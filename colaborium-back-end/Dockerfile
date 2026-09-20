FROM oven/bun:1
WORKDIR /app
EXPOSE 3333
COPY package.json bun.lock ./
RUN bun install
COPY . .
CMD ["bun", "dev"]
