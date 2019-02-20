FROM node:10-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN npm install

EXPOSE 3001
CMD ["npm","start"]