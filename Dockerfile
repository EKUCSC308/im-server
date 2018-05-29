FROM node:8
WORKDIR /home/app

ARG DB_URL
ENV IM_DB_URL "mysql://im_server_admin:test123@127.0.0.1:3306/im_server"

COPY package*.json /home/app/
RUN yarn install

COPY . /home/app

EXPOSE 3001
CMD [ "npm", "start" ]