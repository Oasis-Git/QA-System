FROM node:16 AS frontend

ENV FRONTEND=opt/brace/client
WORKDIR $FRONTEND

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
RUN yarn install

COPY public public
COPY src src
RUN yarn build

RUN yarn global add serve
ENTRYPOINT ["serve", "-s", "build"]
EXPOSE 5000
