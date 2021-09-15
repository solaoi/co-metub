# **co-metub**

![license](https://img.shields.io/github/license/solaoi/co-metub)

This is an application for multiple people to manage the stub APIs.

## Getting Started

### Docker

All you have to do is the following.

```sh
# Specify the port you want to provide
HOST_PORT=8080
# If you run this app on http://, you should set true
DISABLE_SECURE_COOKIES=false
# Let's enjoy!
docker run --init -e SESSION_SECRET_KEY="your random string of at least 32 bytes" \
-e DISABLE_SECURE_COOKIES=$DISABLE_SECURE_COOKIES
-d -p $HOST_PORT:3000 -v $(pwd)/data:/data aota/co-metub:latest
```

#### Persist the stub data

Your stub data will be persisted under /data in the current directory.
