# Dockerfile for Node.js Backend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files for workspace support
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src

# Build TypeScript
WORKDIR /app/backend
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/backend/dist ./backend/dist

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "dist/server.js"]
