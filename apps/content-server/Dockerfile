FROM node:16-alpine

RUN mkdir -p /usr/src/intergallery/content-server

WORKDIR mkdir -p /usr/src/intergallery/content-server

COPY package.json /usr/src/intergallery/content-server

RUN npm install

EXPOSE 5005

CMD [ "npm", "start" ]