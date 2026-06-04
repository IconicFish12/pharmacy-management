import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { ReportQueryDto, ExportQueryDto } from './dto/report-query.dto.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

@Injectable()
export class FinancialReportService {
  constructor(private readonly prisma: DatabaseService) {}

  async getData(query: ReportQueryDto) {
    const { startDate, endDate } = query;

    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate) {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startDate format');
      }
    }
    if (endDate) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw new BadRequestException('Invalid endDate format');
      }
    }

    // Query 1: Sales / Transactions (Income)
    const transactions = await this.prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: {
          select: {
            name: true,
            empId: true,
          },
        },
        transactionDetails: {
          include: {
            medicine: {
              select: {
                medicineName: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });

    // Query 2: Purchase Orders (Expenses) - Only count COMPLETED orders as paid expenses
    const completedOrders = await this.prisma.medicineOrder.findMany({
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
        status: 'COMPLETED',
      },
      include: {
        employee: {
          select: {
            name: true,
            empId: true,
          },
        },
        supplier: {
          select: {
            companyName: true,
          },
        },
        orderDetails: {
          include: {
            medicine: {
              select: {
                medicineName: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    // Calculate metrics
    const totalRevenue = transactions.reduce((acc, t) => acc + t.totalPrice, 0);
    const totalExpenses = completedOrders.reduce((acc, o) => acc + o.totalPrice, 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalTransactionsCount = transactions.length;
    const totalOrdersCount = completedOrders.length;

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        filter: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        totalTransactionsCount,
        totalOrdersCount,
      },
      incomeBreakdown: transactions,
      expenseBreakdown: completedOrders,
    };
  }

  async exportReport(query: ExportQueryDto): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
    const data = await this.getData(query);
    const dateRangeStr =
      query.startDate || query.endDate
        ? `_from_${query.startDate || 'start'}_to_${query.endDate || 'end'}`
        : '_all_time';

    const filename = `financial_report${dateRangeStr}.${query.format}`;

    if (query.format === 'csv') {
      const buffer = Buffer.from(this.generateCsvString(data), 'utf-8');
      return {
        buffer,
        mimeType: 'text/csv',
        filename,
      };
    } else if (query.format === 'excel') {
      const buffer = await this.generateExcelBuffer(data);
      return {
        buffer,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename,
      };
    } else if (query.format === 'pdf') {
      const buffer = await this.generatePdfBuffer(data, query);
      return {
        buffer,
        mimeType: 'application/pdf',
        filename,
      };
    }

    throw new BadRequestException('Unsupported format');
  }

  private generateCsvString(data: any): string {
    const csvLines: string[] = [];

    // Title
    csvLines.push('=== APOTHECARY FINANCIAL REPORT ===');
    csvLines.push(`Generated At,${data.metadata.generatedAt}`);
    csvLines.push(`Date Range,${data.metadata.filter.startDate || 'Start'} to ${data.metadata.filter.endDate || 'End'}`);
    csvLines.push('');

    // Summary KPIs
    csvLines.push('=== FINANCIAL SUMMARY ===');
    csvLines.push(`Total Revenue (Sales),IDR ${data.summary.totalRevenue.toLocaleString()}`);
    csvLines.push(`Total Expenses (Stock Supply),IDR ${data.summary.totalExpenses.toLocaleString()}`);
    csvLines.push(`Net Profit,IDR ${data.summary.netProfit.toLocaleString()}`);
    csvLines.push(`Total Customer Transactions,${data.summary.totalTransactionsCount}`);
    csvLines.push(`Total Completed Restock Orders,${data.summary.totalOrdersCount}`);
    csvLines.push('');

    // Income Breakdown (Transactions)
    csvLines.push('=== INCOME BREAKDOWN (CUSTOMER SALES) ===');
    const incomeHeaders = ['Transaction Date', 'Transaction Code', 'Cashier Name', 'Total Price (IDR)', 'Medicines Sold (Qty x UnitPrice)'];
    csvLines.push(incomeHeaders.join(','));

    for (const t of data.incomeBreakdown) {
      const itemsStr = t.transactionDetails
        .map((d: any) => `${d.medicine?.medicineName || 'Unknown'} (${d.quantity}x${d.unitPrice})`)
        .join('; ');
      
      const row = [
        new Date(t.transactionDate).toLocaleString(),
        t.transactionCode,
        t.employee?.name || 'System/Unknown',
        t.totalPrice,
        itemsStr,
      ];
      csvLines.push(this.formatCsvRow(row));
    }
    csvLines.push('');

    // Expense Breakdown (Purchase Orders)
    csvLines.push('=== EXPENSE BREAKDOWN (STOCK RESTOCK ORDERS) ===');
    const expenseHeaders = ['Order Date', 'Order Code', 'Supplier', 'Purchaser Name', 'Total Price (IDR)', 'Medicines Ordered (Qty x UnitPrice)'];
    csvLines.push(expenseHeaders.join(','));

    for (const o of data.expenseBreakdown) {
      const itemsStr = o.orderDetails
        .map((d: any) => `${d.medicine?.medicineName || 'Unknown'} (${d.quantity}x${d.unitPrice})`)
        .join('; ');
      
      const row = [
        new Date(o.orderDate).toLocaleString(),
        o.orderCode,
        o.supplier?.companyName || 'N/A',
        o.employee?.name || 'System/Unknown',
        o.totalPrice,
        itemsStr,
      ];
      csvLines.push(this.formatCsvRow(row));
    }

    return csvLines.join('\n');
  }

  private formatCsvRow(row: any[]): string {
    return row
      .map((val) => {
        const str = val === null || val === undefined ? '' : String(val);
        const escaped = str.replace(/"/g, '""');
        if (
          escaped.includes(',') ||
          escaped.includes('"') ||
          escaped.includes('\n') ||
          escaped.includes('\r')
        ) {
          return `"${escaped}"`;
        }
        return escaped;
      })
      .join(',');
  }

  private async generateExcelBuffer(data: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pharmacy Management System';
    workbook.created = new Date();

    // Sheet 1: Financial Dashboard
    const dashSheet = workbook.addWorksheet('Dashboard');
    dashSheet.views = [{ showGridLines: true }];

    dashSheet.mergeCells('A1:D1');
    const titleCell = dashSheet.getCell('A1');
    titleCell.value = 'Apothecary Financial Report Dashboard';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '27AE60' }, // Green accent for finances
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dashSheet.getRow(1).height = 40;

    dashSheet.addRow([]);
    dashSheet.addRow(['Report Generated At:', new Date(data.metadata.generatedAt).toLocaleString()]);
    dashSheet.addRow([
      'Reporting Date Range:',
      `${data.metadata.filter.startDate || 'Beginning'} to ${data.metadata.filter.endDate || 'Present'}`,
    ]);
    dashSheet.addRow([]);

    dashSheet.addRow(['Financial Metric', 'Value (IDR)']);
    const statHeaderRow = dashSheet.getRow(6);
    statHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    statHeaderRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
    });

    dashSheet.addRow(['Total Revenue (Sales Income)', data.summary.totalRevenue]);
    dashSheet.addRow(['Total Expenses (Restock Orders)', data.summary.totalExpenses]);
    dashSheet.addRow(['Net Profit / Loss', data.summary.netProfit]);
    dashSheet.addRow(['Total Customer Transactions', data.summary.totalTransactionsCount]);
    dashSheet.addRow(['Total Completed Restock Orders', data.summary.totalOrdersCount]);

    // Format currency columns and border for overview table
    for (let r = 6; r <= 11; r++) {
      const row = dashSheet.getRow(r);
      row.getCell(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      row.getCell(2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      if (r >= 7 && r <= 9) {
        row.getCell(2).numFmt = '"IDR "#,##0.00';
      }
    }

    // Highlight Net Profit green (if positive) or red (if negative)
    const profitCell = dashSheet.getCell('B9');
    if (data.summary.netProfit >= 0) {
      profitCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D4EFDF' } }; // Soft green
      profitCell.font = { bold: true, color: { argb: '196F3D' } };
    } else {
      profitCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FADBD8' } }; // Soft red
      profitCell.font = { bold: true, color: { argb: '943126' } };
    }

    dashSheet.getColumn(1).width = 35;
    dashSheet.getColumn(2).width = 25;

    // Sheet 2: Income Sales
    const incomeSheet = workbook.addWorksheet('Customer Sales (Income)');
    incomeSheet.views = [{ showGridLines: true }];
    incomeSheet.columns = [
      { header: 'Date & Time', key: 'date', width: 22 },
      { header: 'Transaction Code', key: 'code', width: 18 },
      { header: 'Cashier Name', key: 'cashier', width: 20 },
      { header: 'Total Price (IDR)', key: 'total', width: 18 },
      { header: 'Items Sold Detail', key: 'details', width: 50 },
    ];

    incomeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    incomeSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '27AE60' } };
      cell.alignment = { horizontal: 'center' };
    });

    for (const t of data.incomeBreakdown) {
      const itemsStr = t.transactionDetails
        .map((d: any) => `${d.medicine?.medicineName || 'Unknown'} (${d.quantity}x${d.unitPrice.toLocaleString()})`)
        .join(', ');

      const row = incomeSheet.addRow({
        date: new Date(t.transactionDate).toLocaleString(),
        code: t.transactionCode,
        cashier: t.employee?.name || 'System/Unknown',
        total: t.totalPrice,
        details: itemsStr,
      });

      row.getCell(4).numFmt = '"IDR "#,##0.00';
    }

    // Sheet 3: Expenses Purchase Orders
    const expenseSheet = workbook.addWorksheet('Restock Purchases (Expenses)');
    expenseSheet.views = [{ showGridLines: true }];
    expenseSheet.columns = [
      { header: 'Date & Time', key: 'date', width: 22 },
      { header: 'Order Code', key: 'code', width: 22 },
      { header: 'Supplier Company', key: 'supplier', width: 25 },
      { header: 'Purchaser Name', key: 'employee', width: 20 },
      { header: 'Total Price (IDR)', key: 'total', width: 18 },
      { header: 'Items Purchased Detail', key: 'details', width: 50 },
    ];

    expenseSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    expenseSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0392B' } }; // Red header for expenses
      cell.alignment = { horizontal: 'center' };
    });

    for (const o of data.expenseBreakdown) {
      const itemsStr = o.orderDetails
        .map((d: any) => `${d.medicine?.medicineName || 'Unknown'} (${d.quantity}x${d.unitPrice.toLocaleString()})`)
        .join(', ');

      const row = expenseSheet.addRow({
        date: new Date(o.orderDate).toLocaleString(),
        code: o.orderCode,
        supplier: o.supplier?.companyName || 'N/A',
        employee: o.employee?.name || 'System/Unknown',
        total: o.totalPrice,
        details: itemsStr,
      });

      row.getCell(5).numFmt = '"IDR "#,##0.00';
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as any);
  }

  private async generatePdfBuffer(data: any, query: ExportQueryDto): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Header Brand with Finance Green
      doc.rect(0, 0, 595.28, 90).fill('#27AE60');
      doc.fillColor('#FFFFFF');
      doc.fontSize(22).font('Helvetica-Bold').text('APOTHECARY FINANCIAL REPORT', 40, 25);
      doc.fontSize(10).font('Helvetica').text('Income Statement, Revenue & Expenses Breakdown', 40, 52);

      // System Metadata
      doc.fillColor('#FFFFFF');
      doc.fontSize(9).font('Helvetica-Bold').text('Generated At:', 400, 25);
      doc.font('Helvetica').text(new Date(data.metadata.generatedAt).toLocaleString(), 400, 37);
      doc.font('Helvetica-Bold').text('Reporting Period:', 400, 52);
      doc.font('Helvetica').text(
        `${query.startDate || 'Beginning'} to ${query.endDate || 'Present'}`,
        400,
        64,
      );

      doc.y = 110;

      // Section: KPI Financial Cards
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2C3E50').text('Financial Statement Summary', 40, doc.y);
      doc.y += 15;

      const cardWidth = 125;
      const cardHeight = 60;
      const startX = 40;
      const metrics = [
        { title: 'Total Revenue (Sales)', value: `IDR ${data.summary.totalRevenue.toLocaleString()}`, color: '#27AE60' },
        { title: 'Total Expenses (Restock)', value: `IDR ${data.summary.totalExpenses.toLocaleString()}`, color: '#C0392B' },
        {
          title: 'Net Profit / Loss',
          value: `IDR ${data.summary.netProfit.toLocaleString()}`,
          color: data.summary.netProfit >= 0 ? '#27AE60' : '#C0392B',
        },
        { title: 'Sales Transactions', value: `${data.summary.totalTransactionsCount} Orders`, color: '#2980B9' },
      ];

      metrics.forEach((m, idx) => {
        const x = startX + idx * (cardWidth + 5);
        doc.rect(x, doc.y, cardWidth, cardHeight).fill('#F8F9F9');
        doc.rect(x, doc.y, cardWidth, 4).fill(m.color); // top accent line

        doc.fillColor('#7F8C8D').fontSize(8).font('Helvetica').text(m.title, x + 8, doc.y + 12, { width: cardWidth - 16 });
        
        // Dynamic font size adjustment for large currencies
        const valFontSize = m.value.length > 15 ? 9.5 : 10.5;
        doc.fillColor('#2C3E50').fontSize(valFontSize).font('Helvetica-Bold').text(m.value, x + 8, doc.y + 30);
      });

      doc.y += cardHeight + 30;

      // Section: Income Sales Breakdown
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2C3E50').text('Sales & Revenue (Income)', 40, doc.y);
      doc.y += 15;

      const drawIncomeTableHeader = (yVal: number) => {
        doc.rect(40, yVal, 515, 20).fill('#27AE60');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('Date & Time', 45, yVal + 6);
        doc.text('Transaction Code', 155, yVal + 6);
        doc.text('Cashier', 265, yVal + 6);
        doc.text('Amount (IDR)', 365, yVal + 6);
        doc.text('Items Details', 445, yVal + 6);
      };

      drawIncomeTableHeader(doc.y);
      doc.y += 20;

      data.incomeBreakdown.forEach((t: any) => {
        if (doc.y > 750) {
          doc.addPage();
          doc.y = 40;
          drawIncomeTableHeader(doc.y);
          doc.y += 20;
        }

        const rowHeight = 22;
        doc.rect(40, doc.y, 515, rowHeight).fill(doc.y % 44 === 0 ? '#F8F9F9' : '#FFFFFF');

        doc.fillColor('#333333').fontSize(7.5).font('Helvetica');
        doc.text(new Date(t.transactionDate).toLocaleString(), 45, doc.y + 7);
        doc.text(t.transactionCode, 155, doc.y + 7);
        doc.text(t.employee?.name || 'System', 265, doc.y + 7, { width: 95, ellipsis: true });
        
        doc.font('Helvetica-Bold').text(t.totalPrice.toLocaleString(), 365, doc.y + 7);
        doc.font('Helvetica');

        const itemsStr = t.transactionDetails
          .map((d: any) => `${d.medicine?.medicineName || 'Obat'} (x${d.quantity})`)
          .join(', ');
        doc.text(itemsStr, 445, doc.y + 7, { width: 105, height: rowHeight - 4, ellipsis: true });

        doc.y += rowHeight;
      });

      doc.y += 30;

      // Section: Purchase Orders Breakdown
      if (doc.y > 700) {
        doc.addPage();
        doc.y = 40;
      }

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2C3E50').text('Supply Restock Purchases (Expenses)', 40, doc.y);
      doc.y += 15;

      const drawExpenseTableHeader = (yVal: number) => {
        doc.rect(40, yVal, 515, 20).fill('#C0392B');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('Date & Time', 45, yVal + 6);
        doc.text('Order Code', 155, yVal + 6);
        doc.text('Supplier', 265, yVal + 6);
        doc.text('Amount (IDR)', 365, yVal + 6);
        doc.text('Items Details', 445, yVal + 6);
      };

      drawExpenseTableHeader(doc.y);
      doc.y += 20;

      data.expenseBreakdown.forEach((o: any) => {
        if (doc.y > 750) {
          doc.addPage();
          doc.y = 40;
          drawExpenseTableHeader(doc.y);
          doc.y += 20;
        }

        const rowHeight = 22;
        doc.rect(40, doc.y, 515, rowHeight).fill(doc.y % 44 === 0 ? '#F8F9F9' : '#FFFFFF');

        doc.fillColor('#333333').fontSize(7.5).font('Helvetica');
        doc.text(new Date(o.orderDate).toLocaleString(), 45, doc.y + 7);
        doc.text(o.orderCode, 155, doc.y + 7);
        doc.text(o.supplier?.companyName || 'N/A', 265, doc.y + 7, { width: 95, ellipsis: true });
        
        doc.font('Helvetica-Bold').text(o.totalPrice.toLocaleString(), 365, doc.y + 7);
        doc.font('Helvetica');

        const itemsStr = o.orderDetails
          .map((d: any) => `${d.medicine?.medicineName || 'Obat'} (x${d.quantity})`)
          .join(', ');
        doc.text(itemsStr, 445, doc.y + 7, { width: 105, height: rowHeight - 4, ellipsis: true });

        doc.y += rowHeight;
      });

      // Page numbers footer
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fillColor('#7F8C8D').fontSize(8);
        doc.text(
          `Page ${i + 1} of ${pages.count}  |  Apothecary Financial Management`,
          40,
          790,
          { align: 'center', width: 515 }
        );
      }

      doc.end();
    });
  }
}
