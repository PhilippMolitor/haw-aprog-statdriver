FROM node:13-alpine AS builder

WORKDIR /app
COPY . /app

RUN apk add --no-cache python make gcc g++ \
    && npm install \
    && mkdir /data

FROM node:13-alpine

WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_PATH=/data
VOLUME /data
EXPOSE 3000
CMD ["npm", "run", "start"]
