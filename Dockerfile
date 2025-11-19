FROM node:24-slim

WORKDIR /app
COPY . .

RUN npm ci && npm cache clean --force

CMD ["node", "src/server.js"]
