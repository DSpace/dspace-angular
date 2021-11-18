# This image will be published as dspace/dspace-angular
# See https://dspace-labs.github.io/DSpace-Docker-Images/ for usage details

FROM node:lts-alpine as build

ARG DSPACE_HOST=0.0.0.0
ARG DSPACE_PORT=4000
ARG DSPACE_NAMESPACE=/
ARG DSPACE_SSL=false

ARG DSPACE_REST_HOST=api7.dspace.org
ARG DSPACE_REST_PORT=443
ARG DSPACE_REST_NAMESPACE=/server
ARG DSPACE_REST_SSL=true

ENV DSPACE_HOST=${DSPACE_HOST}
ENV DSPACE_PORT=${DSPACE_PORT}
ENV DSPACE_NAMESPACE=${DSPACE_NAMESPACE}
ENV DSPACE_SSL=${DSPACE_SSL}

ENV DSPACE_REST_HOST=${DSPACE_REST_HOST}
ENV DSPACE_REST_PORT=${DSPACE_REST_PORT}
ENV DSPACE_REST_NAMESPACE=${DSPACE_REST_NAMESPACE}
ENV DSPACE_REST_SSL=${DSPACE_REST_SSL}

WORKDIR /dspace-angular

COPY . .

RUN yarn install --ignore-scripts

RUN yarn build:prod


FROM node:lts-alpine as production

RUN apk update

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG APP_ID_NUMBER=1099
ARG APP_ID_NAME=dspace-angular
ARG GROUP_ID_NUMBER=1199
ARG GROUP_ID_NAME=dspace-angular
ARG APP_NAME=dspace-angular

RUN deluser --remove-home node
RUN addgroup -S ${GROUP_ID_NAME} -g ${GROUP_ID_NUMBER}
RUN adduser -h /home/${APP_ID_NAME} -s /bin/sh -u ${APP_ID_NUMBER} -S ${APP_ID_NAME} -G ${GROUP_ID_NAME}

WORKDIR /home/${APP_ID_NAME}

USER ${APP_ID_NAME}

COPY --chown=${APP_ID_NAME}:${GROUP_ID_NAME} package*.json /home/${APP_ID_NAME}/

RUN yarn install --production --ignore-scripts

COPY --from=build --chown=${APP_ID_NAME}:${GROUP_ID_NAME} /dspace-angular/dist /home/${APP_ID_NAME}/dist

CMD [ "node", "dist/server/main" ]
