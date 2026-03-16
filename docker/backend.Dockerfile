# Backend Dockerfile - Simplified build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9

# Copy entire project (we'll use .dockerignore to filter)
COPY . .

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install

# Build shared package first
RUN pnpm --filter @stackoverkill/shared build

# Build backend
RUN pnpm --filter @stackoverkill/backend build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy package files for production install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install pnpm and production dependencies
RUN npm install -g pnpm@9 && \
    pnpm install --prod --ignore-scripts

# Copy built files
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/assets ./apps/backend/assets
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Create data directory
RUN mkdir -p /app/data && chown expressjs:nodejs /app/data

USER expressjs

WORKDIR /app/apps/backend

EXPOSE 3001

ENV PORT=3001
ENV DATA_DIR=/app/data

CMD ["node", "dist/index.js"]
