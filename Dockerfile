FROM node:8
WORKDIR /home/app

ARG CSC308_DB_HOST
ENV CSC308_DB_HOST $CSC308_DB_HOST

COPY package*.json /home/app
RUN yarn install

COPY . /home/app

EXPOSE 3000
CMD [ "npm", "start" ]