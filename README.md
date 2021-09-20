# **co-metub**

![license](https://img.shields.io/github/license/solaoi/co-metub)
[![CodeQL](https://github.com/solaoi/co-metub/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/solaoi/co-metub/actions/workflows/codeql-analysis.yml)

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
-e DISABLE_SECURE_COOKIES=$DISABLE_SECURE_COOKIES \
-d -p $HOST_PORT:3000 -v $(pwd)/data:/data ghcr.io/solaoi/co-metub:latest
```

#### Persist the stub data

Your stub data will be persisted under /data in the current directory.

#### See the stub data

```sh
# Specify the port you want to provide
HOST_PORT=3000
docker run --init -d -p $HOST_PORT:5555 -v $(pwd)/data:/data ghcr.io/solaoi/co-metub:latest \
blitz prisma studio
```

## Usage

### Create Project

Project is the place to manage your stubs.

<img width="912" alt="スクリーンショット 2021-09-18 0 42 26" src="https://user-images.githubusercontent.com/46414076/133816382-fd6c7ab5-e91b-4378-84e2-f1356314937d.png">
<img width="912" alt="スクリーンショット 2021-09-18 0 44 26" src="https://user-images.githubusercontent.com/46414076/133816599-a7eb710d-666c-4f58-8392-cb26806dcb51.png">

### Create Stub

<img width="912" alt="スクリーンショット 2021-09-18 0 45 59" src="https://user-images.githubusercontent.com/46414076/133816811-18560c1b-b429-483e-a180-f416c1ad8df6.png">
<img width="912" alt="スクリーンショット 2021-09-20 15 06 20" src="https://user-images.githubusercontent.com/46414076/133962240-264c2bef-dd40-4a22-a261-8e31936c9bc1.png">

### Get Stub URL

You get the stub with the copy button.

#### Project

<img width="912" alt="スクリーンショット 2021-09-18 0 48 55" src="https://user-images.githubusercontent.com/46414076/133817247-e355bdbf-b83a-4020-99e8-d192bb991f58.png">

#### Stub

<img width="912" alt="スクリーンショット 2021-09-20 15 08 30" src="https://user-images.githubusercontent.com/46414076/133962354-80ac9bc8-daea-4e30-982e-39c6d4770d85.png">
