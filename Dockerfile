# This image will be published as dspace/dspace-angular
# See https://github.com/DSpace/dspace-angular/tree/main/docker for usage details

FROM docker.io/node:22-alpine

# Ensure Python and other build tools are available
# These are needed to install some node modules, especially on linux/arm64
RUN apk --no-cache add python3 make g++

WORKDIR /app

# Copy over package files first, so this layer will only be rebuilt if those files change.
COPY package.json package-lock.json ./
# NOTE: "ci" = clean install from package files
RUN npm ci

# Add the rest of the source code
COPY . /app/

# When running in dev mode, 4GB of memory is required to build & launch the app.
# This default setting can be overridden as needed in your shell, via an env file or in docker-compose.
# See Docker environment var precedence: https://docs.docker.com/compose/environment-variables/envvars-precedence/
ENV NODE_OPTIONS="--max_old_space_size=4096"

# On startup, run in DEVELOPMENT mode (this defaults to live reloading enabled, etc).
ENV NODE_ENV=development

EXPOSE 4000

# On startup, run this command to start application in dev mode
ENTRYPOINT [ "npm", "run", "serve" ]
# By default set host to 0.0.0.0 to listen/accept connections from all IP addresses.
# Poll for changes every 5 seconds (if any detected, app will rebuild/restart)
CMD ["--", "--host 0.0.0.0", "--poll 5000"]
