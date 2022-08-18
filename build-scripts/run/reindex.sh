#!/bin/bash

if [[ "x$ENVFILE" == "x" ]]; then
    export ENVFILE=$(pwd)/envs/.default
fi

pushd ../..
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli oai import -c
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli index-discovery
docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli database migrate force
# docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli
# docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli
# docker-compose --env-file $ENVFILE -p dq-d7 -f docker/cli.yml run --rm dspace-cli
popd
