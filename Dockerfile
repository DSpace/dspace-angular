# This image will be published as dspace/dspace-angular
# See https://dspace-labs.github.io/DSpace-Docker-Images/ for usage details

FROM node:12-alpine
WORKDIR /app
ADD . /app/
EXPOSE 3000

RUN yarn install
CMD yarn run watch
