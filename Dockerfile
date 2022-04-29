FROM node:18.0.0-alpine as builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN apk add --no-cache make gcc g++ python3 libtool autoconf automake
RUN npm i

FROM node:18.0.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . .
COPY --from=builder /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

EXPOSE 3000
#
# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini

# ENTRYPOINT ["/sbin/tini", "--"]

CMD blitz prisma migrate deploy; chmod -R 766 /data; blitz start
