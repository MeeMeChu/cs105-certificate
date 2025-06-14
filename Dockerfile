FROM node:23-alpine AS builder

WORKDIR /opt/app

COPY package.json .
COPY tsconfig.json .

RUN  yarn global add pm2 typescript@5.6.2  && yarn

COPY . .

RUN yarn prisma generate
RUN yarn build

FROM node:23-alpine AS runner

WORKDIR /opt/app

COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/prisma ./prisma
COPY --from=builder /opt/app/package.json ./package.json
COPY --from=builder /opt/app/ecosystem.config.js ./ecosystem.config.js

RUN yarn global add pm2

EXPOSE 3000

CMD ["pm2-docker", "ecosystem.config.js"]