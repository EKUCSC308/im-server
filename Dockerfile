FROM node:8
WORKDIR /home/app

ARG DB_URL
ENV CSC308_DB_HOST $DB_URL

COPY package*.json /home/app
RUN yarn install

COPY . /home/app

EXPOSE 3001
CMD [ "yarn", "start" ]