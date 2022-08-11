FROM node:18-slim as builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package.json package-lock.json .npmrc ./
# overrides field on package.json is not allowd npm ci command...
RUN npm i && npm update

FROM node:18-slim
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . .
COPY --from=builder /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl && npm run build

EXPOSE 3000
#
# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini

# ENTRYPOINT ["/sbin/tini", "--"]

CMD blitz prisma migrate deploy; chmod -R 766 /data; blitz start
