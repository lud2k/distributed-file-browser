FROM node:12.17

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3000

COPY webpack-backend-config.js .
COPY webpack-frontend-config.js .
COPY frontend ./frontend
COPY backend ./backend

RUN npm run build:backend
RUN npm run build:frontend

CMD [ "npm", "start" ]
