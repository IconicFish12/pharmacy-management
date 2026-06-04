import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { ReportQueryDto, ExportQueryDto } from './dto/report-query.dto.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

@Injectable()
export class OperationalReportService {
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

    // Query 1: Medicines with category and supplier
    const medicines = await this.prisma.medicine.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        medicineName: 'asc',
      },
    });

    // Query 2: Activity logs filtered by date range if provided
    const activityLogs = await this.prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: {
          select: {
            name: true,
            empId: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Custom operational stats
    const totalMedicines = medicines.length;
    const lowStockMedicines = medicines.filter((m) => m.stock <= 15).length;
    const outOfStockMedicines = medicines.filter((m) => m.stock === 0).length;
    const expiredMedicines = medicines.filter(
      (m) => new Date(m.expiredDate) < new Date(),
    ).length;

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        filter: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
      stats: {
        totalMedicines,
        lowStockMedicines,
        outOfStockMedicines,
        expiredMedicines,
        totalActivityLogs: activityLogs.length,
      },
      medicines,
      activityLogs,
    };
  }

  async exportReport(query: ExportQueryDto): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
    const data = await this.getData(query);
    const dateRangeStr =
      query.startDate || query.endDate
        ? `_from_${query.startDate || 'start'}_to_${query.endDate || 'end'}`
        : '_all_time';

    const filename = `operational_report${dateRangeStr}.${query.format}`;

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

    // Header Metadata
    csvLines.push('=== APOTHECARY OPERATIONAL REPORT ===');
    csvLines.push(`Generated At,${data.metadata.generatedAt}`);
    csvLines.push(`Date Range,${data.metadata.filter.startDate || 'Start'} to ${data.metadata.filter.endDate || 'End'}`);
    csvLines.push('');

    // Summary Stats
    csvLines.push('=== OPERATIONAL SUMMARY STATS ===');
    csvLines.push(`Total Medicines,${data.stats.totalMedicines}`);
    csvLines.push(`Low Stock Medicines (<=15),${data.stats.lowStockMedicines}`);
    csvLines.push(`Out of Stock Medicines,${data.stats.outOfStockMedicines}`);
    csvLines.push(`Expired Medicines,${data.stats.expiredMedicines}`);
    csvLines.push(`Total Activities Logged,${data.stats.totalActivityLogs}`);
    csvLines.push('');

    // Section 1: Medicine Inventory
    csvLines.push('=== MEDICINE INVENTORY ===');
    const medHeaders = ['SKU', 'Medicine Name', 'Category', 'Stock', 'Price', 'Supplier', 'Expiry Date'];
    csvLines.push(medHeaders.join(','));

    for (const med of data.medicines) {
      const row = [
        med.sku,
        med.medicineName,
        med.category?.categoryName || 'N/A',
        med.stock,
        med.price,
        med.supplier?.companyName || 'N/A',
        new Date(med.expiredDate).toLocaleDateString(),
      ];
      csvLines.push(this.formatCsvRow(row));
    }
    csvLines.push('');

    // Section 2: Activity Logs
    csvLines.push('=== EMPLOYEE ACTIVITY LOGS ===');
    const logHeaders = ['Date & Time', 'Employee Name', 'Employee ID', 'Role', 'Action', 'Resource Type', 'Resource ID'];
    csvLines.push(logHeaders.join(','));

    for (const log of data.activityLogs) {
      const row = [
        new Date(log.createdAt).toLocaleString(),
        log.employee?.name || 'System/Unknown',
        log.employee?.empId || 'N/A',
        log.employee?.role || 'N/A',
        log.action,
        log.resourceType || 'N/A',
        log.resourceId || 'N/A',
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

    // Sheet 1: Dashboard Overview
    const dashSheet = workbook.addWorksheet('Overview');
    dashSheet.views = [{ showGridLines: true }];

    dashSheet.mergeCells('A1:D1');
    const titleCell = dashSheet.getCell('A1');
    titleCell.value = 'Pharmacy Operational Report Overview';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '16A085' },
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dashSheet.getRow(1).height = 40;

    dashSheet.addRow([]);
    dashSheet.addRow(['Report Generated At:', new Date(data.metadata.generatedAt).toLocaleString()]);
    dashSheet.addRow([
      'Date Range Filter:',
      `${data.metadata.filter.startDate || 'Beginning'} to ${data.metadata.filter.endDate || 'Present'}`,
    ]);
    dashSheet.addRow([]);

    dashSheet.addRow(['Operational Metric', 'Value']);
    const statHeaderRow = dashSheet.getRow(6);
    statHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    statHeaderRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
    });

    dashSheet.addRow(['Total Medicines in Inventory', data.stats.totalMedicines]);
    dashSheet.addRow(['Low Stock Medicines (<= 15 units)', data.stats.lowStockMedicines]);
    dashSheet.addRow(['Out of Stock Medicines', data.stats.outOfStockMedicines]);
    dashSheet.addRow(['Expired Medicines', data.stats.expiredMedicines]);
    dashSheet.addRow(['Total Employee Activities Logged', data.stats.totalActivityLogs]);

    // Border for overview table
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
    }
    dashSheet.getColumn(1).width = 35;
    dashSheet.getColumn(2).width = 25;

    // Sheet 2: Medicine Inventory
    const medSheet = workbook.addWorksheet('Medicine Inventory');
    medSheet.views = [{ showGridLines: true }];
    medSheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Medicine Name', key: 'name', width: 25 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Stock', key: 'stock', width: 12 },
      { header: 'Price (IDR)', key: 'price', width: 15 },
      { header: 'Supplier', key: 'supplier', width: 25 },
      { header: 'Expiry Date', key: 'expiry', width: 18 },
    ];

    medSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    medSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '16A085' } };
      cell.alignment = { horizontal: 'center' };
    });

    for (const med of data.medicines) {
      const row = medSheet.addRow({
        sku: med.sku,
        name: med.medicineName,
        category: med.category?.categoryName || 'N/A',
        stock: med.stock,
        price: med.price,
        supplier: med.supplier?.companyName || 'N/A',
        expiry: new Date(med.expiredDate).toLocaleDateString(),
      });

      // Highlight low stock or expired medicines
      const isExpired = new Date(med.expiredDate) < new Date();
      if (isExpired) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FADBD8' } }; // Soft red
        });
      } else if (med.stock <= 15) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCF3CF' } }; // Soft yellow
        });
      }
    }

    // Sheet 3: Employee Activity Logs
    const logSheet = workbook.addWorksheet('Activity Logs');
    logSheet.views = [{ showGridLines: true }];
    logSheet.columns = [
      { header: 'Date & Time', key: 'date', width: 22 },
      { header: 'Employee Name', key: 'empName', width: 20 },
      { header: 'Employee ID', key: 'empId', width: 15 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Action', key: 'action', width: 30 },
      { header: 'Resource Type', key: 'resType', width: 18 },
      { header: 'Resource ID', key: 'resId', width: 36 },
    ];

    logSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    logSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
      cell.alignment = { horizontal: 'center' };
    });

    for (const log of data.activityLogs) {
      logSheet.addRow({
        date: new Date(log.createdAt).toLocaleString(),
        empName: log.employee?.name || 'System/Unknown',
        empId: log.employee?.empId || 'N/A',
        role: log.employee?.role || 'N/A',
        action: log.action,
        resType: log.resourceType || 'N/A',
        resId: log.resourceId || 'N/A',
      });
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

      // Header Brand
      doc.rect(0, 0, 595.28, 90).fill('#16A085');
      doc.fillColor('#FFFFFF');
      doc.fontSize(22).font('Helvetica-Bold').text('APOTHECARY OPERATIONAL REPORT', 40, 25);
      doc.fontSize(10).font('Helvetica').text('Apothecary Management & Activity Tracking', 40, 52);

      // System Metadata
      doc.fillColor('#333333');
      doc.fontSize(9).font('Helvetica-Bold').text('Generated At:', 400, 25);
      doc.font('Helvetica').text(new Date(data.metadata.generatedAt).toLocaleString(), 400, 37);
      doc.font('Helvetica-Bold').text('Reporting Period:', 400, 52);
      doc.font('Helvetica').text(
        `${query.startDate || 'Beginning'} to ${query.endDate || 'Present'}`,
        400,
        64,
      );

      doc.y = 110;

      // Section: Overview Cards
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2C3E50').text('Operational Summary', 40, doc.y);
      doc.y += 15;

      const cardWidth = 100;
      const cardHeight = 50;
      const startX = 40;
      const metrics = [
        { title: 'Total Medicines', value: data.stats.totalMedicines, color: '#2C3E50' },
        { title: 'Low Stock', value: data.stats.lowStockMedicines, color: '#F39C12' },
        { title: 'Out of Stock', value: data.stats.outOfStockMedicines, color: '#C0392B' },
        { title: 'Expired', value: data.stats.expiredMedicines, color: '#7F8C8D' },
        { title: 'Total Actions', value: data.stats.totalActivityLogs, color: '#2980B9' },
      ];

      metrics.forEach((m, idx) => {
        const x = startX + idx * (cardWidth + 4);
        doc.rect(x, doc.y, cardWidth, cardHeight).fill('#F8F9F9');
        doc.rect(x, doc.y, cardWidth, 4).fill(m.color); // top accent line

        doc.fillColor('#7F8C8D').fontSize(8).font('Helvetica').text(m.title, x + 5, doc.y + 10, { width: cardWidth - 10 });
        doc.fillColor('#2C3E50').fontSize(14).font('Helvetica-Bold').text(String(m.value), x + 5, doc.y + 22);
      });

      doc.y += cardHeight + 30;

      // Section: Medicine Stock Inventory (Top 15 as sample or complete table)
      // Since PDF can get too long, we will print the medicines and page-break as needed
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2C3E50').text('Medicine Stock Status', 40, doc.y);
      doc.y += 15;

      const drawMedicineTableHeader = (yVal: number) => {
        doc.rect(40, yVal, 515, 20).fill('#16A085');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('SKU', 45, yVal + 6);
        doc.text('Medicine Name', 125, yVal + 6);
        doc.text('Category', 245, yVal + 6);
        doc.text('Stock', 355, yVal + 6);
        doc.text('Price (IDR)', 405, yVal + 6);
        doc.text('Expiry Date', 475, yVal + 6);
      };

      drawMedicineTableHeader(doc.y);
      doc.y += 20;

      data.medicines.forEach((med: any) => {
        if (doc.y > 750) {
          doc.addPage();
          doc.y = 40;
          drawMedicineTableHeader(doc.y);
          doc.y += 20;
        }

        // Zebra striping
        const rowHeight = 18;
        const isExpired = new Date(med.expiredDate) < new Date();
        const isLowStock = med.stock <= 15;
        let bg = '#FFFFFF';
        if (isExpired) bg = '#FADBD8'; // red highlight
        else if (isLowStock) bg = '#FCF3CF'; // yellow highlight

        doc.rect(40, doc.y, 515, rowHeight).fill(bg);

        doc.fillColor('#333333').fontSize(7.5).font('Helvetica');
        doc.text(med.sku, 45, doc.y + 5);
        doc.text(med.medicineName, 125, doc.y + 5, { width: 115, height: rowHeight - 2, ellipsis: true });
        doc.text(med.category?.categoryName || 'N/A', 245, doc.y + 5, { width: 105, height: rowHeight - 2, ellipsis: true });
        
        // Stock and styling
        if (isLowStock) doc.fillColor('#C0392B').font('Helvetica-Bold');
        doc.text(String(med.stock), 355, doc.y + 5);
        doc.fillColor('#333333').font('Helvetica');

        doc.text(med.price.toLocaleString(), 405, doc.y + 5);
        doc.text(new Date(med.expiredDate).toLocaleDateString(), 475, doc.y + 5);

        doc.y += rowHeight;
      });

      doc.y += 30;

      // Section: Employee Activity Logs
      if (doc.y > 700) {
        doc.addPage();
        doc.y = 40;
      }

      doc.fontSize(14).font('Helvetica-Bold').fillColor('#2C3E50').text('Recent Employee Activity Logs', 40, doc.y);
      doc.y += 15;

      const drawActivityTableHeader = (yVal: number) => {
        doc.rect(40, yVal, 515, 20).fill('#2C3E50');
        doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
        doc.text('Date & Time', 45, yVal + 6);
        doc.text('Employee (ID)', 165, yVal + 6);
        doc.text('Role', 275, yVal + 6);
        doc.text('Action', 345, yVal + 6);
        doc.text('Resource (ID)', 445, yVal + 6);
      };

      drawActivityTableHeader(doc.y);
      doc.y += 20;

      data.activityLogs.forEach((log: any) => {
        if (doc.y > 750) {
          doc.addPage();
          doc.y = 40;
          drawActivityTableHeader(doc.y);
          doc.y += 20;
        }

        const rowHeight = 18;
        doc.rect(40, doc.y, 515, rowHeight).fill(doc.y % 36 === 0 ? '#F8F9F9' : '#FFFFFF');

        doc.fillColor('#333333').fontSize(7.5).font('Helvetica');
        doc.text(new Date(log.createdAt).toLocaleString(), 45, doc.y + 5);
        
        const empStr = `${log.employee?.name || 'System'} (${log.employee?.empId || '-'})`;
        doc.text(empStr, 165, doc.y + 5, { width: 105, height: rowHeight - 2, ellipsis: true });
        doc.text(log.employee?.role || 'N/A', 275, doc.y + 5);
        doc.text(log.action, 345, doc.y + 5, { width: 95, height: rowHeight - 2, ellipsis: true });
        
        const resStr = log.resourceType ? `${log.resourceType} (${log.resourceId?.substring(0, 8)})` : '-';
        doc.text(resStr, 445, doc.y + 5, { width: 105, height: rowHeight - 2, ellipsis: true });

        doc.y += rowHeight;
      });

      // Page numbers footer
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fillColor('#7F8C8D').fontSize(8);
        doc.text(
          `Page ${i + 1} of ${pages.count}  |  Apothecary Management System`,
          40,
          790,
          { align: 'center', width: 515 }
        );
      }

      doc.end();
    });
  }
}
