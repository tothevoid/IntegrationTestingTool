FROM node:latest as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install

COPY . .
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL
RUN npm run build
CMD ["serve", "-p", "80", "-s", "."]