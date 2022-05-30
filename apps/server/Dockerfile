FROM node:16-alpine

RUN mkdir -p /usr/src/intergallery/server

WORKDIR mkdir -p /usr/src/intergallery/server

COPY package.json /usr/src/intergallery/server

RUN npm install

EXPOSE 3001

CMD [ "npm", "start" ]