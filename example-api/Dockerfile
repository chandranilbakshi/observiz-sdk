FROM oven/bun:1.1 AS builder

WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY example-api ./example-api

RUN bun install

WORKDIR /app/example-api

RUN bun build src/index.ts --target=node --outdir=dist

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/example-api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/example-api/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/index.js"]
