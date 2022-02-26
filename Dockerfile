FROM mhart/alpine-node:16 as builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN apk add --no-cache make gcc g++ python3 libtool autoconf automake
RUN npm ci

FROM mhart/alpine-node:slim-16
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . .
COPY --from=builder /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN blitz prisma generate && blitz build

EXPOSE 3000
#
# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini

# ENTRYPOINT ["/sbin/tini", "--"]

CMD blitz prisma migrate deploy; chmod -R 766 /data; blitz start
