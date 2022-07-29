FROM node:16

WORKDIR /home/node/app

COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/

RUN npm i

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start"]