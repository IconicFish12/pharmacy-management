# First Stage: --Build Stage

# Image Base and workdir 
# for pharma-ease build stage
FROM node:24-alpine AS builder
WORKDIR usr/src/app

# Copy package and package-lock json file
# and application Dependencies installation 
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# adding database url
ENV DATABASE_URL="postgresql://mock_user:mock_password@localhost:5432/mock_db"

# Running Generate Prisma
RUN npx prisma generate --schema=./src/database/prisma/schema.prisma

# Build and prune production trash
# from node_modules
RUN npm run build
RUN npm prune --production

# Second Stage: --Runner Stage

# Image Base and workdir 
# for pharma-ease runner stage
FROM node:24-alpine AS runner
WORKDIR usr/src/app

# Take the prodcution Environment
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma

# Running the application
CMD ["node", "dist/src/main.js"]

# Exposing application main port
EXPOSE 5000

# Define Default user for this image
USER node

