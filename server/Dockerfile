FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --workspace server --omit=dev

FROM node:22-alpine
WORKDIR /app/server
ENV NODE_ENV=production
RUN apk add --no-cache ca-certificates nmap
COPY --from=deps /app/node_modules /app/node_modules
COPY server/package*.json ./
COPY server/src ./src
RUN mkdir -p /app/server/data
EXPOSE 5000
CMD ["node", "src/index.js"]
