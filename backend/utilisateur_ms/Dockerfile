# Use the Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN pnpm build

# Expose the application port
EXPOSE 3000

# Set the command to run the application
CMD ["pnpm", "start:prod"]

RUN pnpm prisma generate
