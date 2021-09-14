FROM mhart/alpine-node:14 as builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN apk add --no-cache make gcc g++ python3 libtool autoconf automake
RUN npm ci

FROM mhart/alpine-node:slim-14
WORKDIR /data
WORKDIR /app

COPY . .
COPY --from=builder /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN ./node_modules/.bin/blitz prisma generate && ./node_modules/.bin/blitz build

EXPOSE 3000
#
# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini

# ENTRYPOINT ["/sbin/tini", "--"]

CMD ./node_modules/.bin/blitz prisma migrate deploy; ./node_modules/.bin/blitz start
