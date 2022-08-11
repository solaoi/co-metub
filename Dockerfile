FROM node:18-alpine as builder
WORKDIR /app

# Install Python/pip and dependencies for M1 Mac
ENV PYTHONUNBUFFERED=1
RUN apk add g++ make
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY package.json package-lock.json .npmrc ./
# overrides field on package.json is not allowd npm ci command...
RUN npm i && npm update

FROM node:18-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . .
COPY --from=builder /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000
#
# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini

# ENTRYPOINT ["/sbin/tini", "--"]

CMD blitz prisma migrate deploy; chmod -R 766 /data; blitz start
