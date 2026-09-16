FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
CMD ["bun", "dev"]