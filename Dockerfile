FROM node:lts-bullseye-slim AS builder
WORKDIR /opt/app
COPY package.json .
COPY tsconfig.json .
RUN  yarn global add pm2 typescript@5.6.2  && yarn

FROM builder AS release
COPY . .
# RUN  yarn build && mv .env.prod .env && mv process.prod.yml process.yml
RUN  yarn build
CMD ["pm2-docker", "start", "process.yml"]