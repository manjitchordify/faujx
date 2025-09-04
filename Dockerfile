# syntax=docker/dockerfile:1

# ----------------------------
# 1. Base Image for All Stages
# ----------------------------
FROM node:20-alpine AS base

# Add libc6-compat for native modules that need glibc
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# ----------------------------
# 2. Dependencies Layer
# ----------------------------
FROM base AS deps

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (you can also do `npm ci` if using CI)
RUN npm install

# ----------------------------
# 3. Build Layer
# ----------------------------
FROM base AS builder

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the app
COPY . .

# Set environment for production build
ENV NODE_ENV=production

# Build Next.js in standalone mode
RUN npm run build

# Optional: list .next contents for debugging
# RUN ls -lR .next

# ----------------------------
# 4. Production Runtime
# ----------------------------
FROM base AS runner

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs

# Set correct working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use non-root user for security
USER nextjs

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js app
CMD ["node", "server.js"]
