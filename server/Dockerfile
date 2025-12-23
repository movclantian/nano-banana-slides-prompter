FROM oven/bun:1

WORKDIR /app

# Copy package.json files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 3001

# Start server
CMD ["bun", "run", "start"]
