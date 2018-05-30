FROM node:8
WORKDIR /home/app

COPY package*.json /home/app/
RUN yarn install

COPY . /home/app

EXPOSE 3001
CMD [ "npm", "start" ]