# This image will be published as dspace/dspace-angular
# See https://dspace-labs.github.io/DSpace-Docker-Images/ for usage details

FROM node:12-alpine
WORKDIR /app
ADD . /app/
EXPOSE 4000

# We run yarn install with an increased network timeout (5min) to avoid "ESOCKETTIMEDOUT" errors from hub.docker.com
# See, for example https://github.com/yarnpkg/yarn/issues/5540
RUN yarn install --network-timeout 300000
CMD yarn run start:dev
