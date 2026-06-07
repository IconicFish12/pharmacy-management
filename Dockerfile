# Stage 1: Build Stage
FROM node:24-alpine AS builder
WORKDIR /usr/src/app

# Salin manifest dan install dependensi lengkap untuk build
COPY package*.json ./
RUN npm ci

# Copy prisma directory to root project
COPY /src/database/prisma ./prisma

# Pasang dummy URL agar prisma generate berhasil tanpa membocorkan kredensial asli
ENV DATABASE_URL="postgresql://mock_user:mock_password@localhost:5432/mock_db"
RUN npx prisma generate 

# Salin semua source code aplikasi
COPY . .

# Build aplikasi NestJS
RUN npm run build

# Hapus dependensi development untuk menghemat ruang penyimpanan
RUN npm prune --production


# Stage 2: Runner Stage (Aman & Ringan)
FROM node:24-alpine AS runner
WORKDIR /usr/src/app

# Set lingkungan produksi
ENV NODE_ENV=production

# Pastikan kepemilikan direktori kerja diubah ke user 'node' sejak awal
RUN chown -R node:node /usr/src/app

# Gunakan non-root user sebelum menyalin file untuk keamanan
USER node

# Salin manifest dan hasil kompilasi dari builder dengan hak akses user node
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts

# Jalankan aplikasi menggunakan node langsung (lebih ringan daripada npm run)
CMD ["sh", "-c", "sleep 5 && npx prisma migrate deploy && node dist/src/main"]

EXPOSE 5000
