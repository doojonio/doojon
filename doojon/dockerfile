FROM node:16

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm ci

ENTRYPOINT [ "./script/doojon.js", "server", "-l", "http://*:8080" ]
