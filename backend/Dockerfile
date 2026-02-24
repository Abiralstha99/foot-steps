FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN DIRECT_URL="file:./dummy.db" DATABASE_URL="file:./dummy.db" npx prisma generate

EXPOSE 3000

USER node

CMD ["npm", "start"]
