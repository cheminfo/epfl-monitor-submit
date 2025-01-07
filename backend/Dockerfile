FROM node:22

EXPOSE 50107

RUN mkdir /node
COPY package.json /node/

WORKDIR /node
RUN npm i

WORKDIR /
COPY ./src /node/src

WORKDIR /node
CMD npm start
