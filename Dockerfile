# Multi-stage Dockerfile for MCP Doppler Server
ARG NODE_VERSION=18-alpine

# ============================================
# Dependencies stage
# ============================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ============================================
# Build stage
# ============================================
FROM node:${NODE_VERSION} AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:${NODE_VERSION} AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose MCP server port (if applicable)
# EXPOSE 3000

# Health check (if server has health endpoint)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the MCP server
CMD ["node", "dist/index.js"]