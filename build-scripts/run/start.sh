#!/bin/bash

if [[ "x$ENVFILE" == "x" ]]; then
    export ENVFILE=$(pwd)/envs/.default
fi 

source $ENVFILE

# docker-compose does not pull those that have `build` section?!
docker pull $DSPACE_UI_IMAGE

pushd ../..
docker-compose --env-file $ENVFILE -f docker/docker-compose.yml -f docker/docker-compose-rest.yml pull
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/docker-compose.yml -f docker/docker-compose-rest.yml up -d --no-build
popd

# Create admin user
# set DOCKER_OWNER to match our image (see cli.yml)
pushd ../..
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli create-administrator -e test@test.edu -f admin -l user -p admin -c en
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli user --add -m user@test.edu -g meno -s priezvisko -l en -p user
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli version
popd
