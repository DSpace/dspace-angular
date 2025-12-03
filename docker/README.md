# Docker Compose files

***
:warning: **THESE IMAGES ARE NOT PRODUCTION READY**  The below Docker Compose images/resources were built for development/testing only.  Therefore, they may not be fully secured or up-to-date, and should not be used in production.

If you wish to run DSpace on Docker in production, we recommend building your own Docker images. You are welcome to borrow ideas/concepts from the below images in doing so. But, the below images should not be used "as is" in any production scenario.
***

## Overview
The scripts in this directory can be used to start the DSpace User Interface (frontend) in Docker.
Optionally, the backend (REST API) might also be started in Docker.

For additional options/settings in starting the backend (REST API) in Docker, see the Docker Compose
documentation for the backend: https://github.com/DSpace/DSpace/blob/main/dspace/src/main/docker-compose/README.md

## Root directory

The root directory of this project contains all the Dockerfiles which may be referenced by
the Docker compose scripts in this 'docker' folder.

### Dockerfile

This Dockerfile is used to build a *development* DSpace Angular UI image, published as 'dspace/dspace-angular'

```
docker build -t dspace/dspace-angular:latest .
```

This image is built *automatically* after each commit is made to the `main` branch.

Admins to our DockerHub repo can manually publish with the following command.
```
docker push dspace/dspace-angular:latest
```

### Dockerfile.dist

The `Dockerfile.dist` is used to generate a *production* build and runtime environment.

```bash
# build the latest image
docker build -f Dockerfile.dist -t dspace/dspace-angular:latest-dist .
```

A default/demo version of this image is built *automatically*.

## 'docker' directory
- docker-compose.yml
  - Starts DSpace Angular with Docker Compose from the current branch.  This file assumes that a DSpace REST instance will also be started in Docker.
- docker-compose-rest.yml
  - Runs a published instance of the DSpace REST API - persists data in Docker volumes
- docker-compose-ci.yml
  - Runs a published instance of the DSpace REST API for CI testing.  The database is re-populated from a SQL dump on each startup.
- cli.yml
  - Docker compose file that provides a DSpace CLI container to work with a running DSpace REST container.
- cli.assetstore.yml
  - Docker compose file that will download and install data into a DSpace REST assetstore.  This script points to a default dataset that will be utilized for CI testing.


## To refresh / pull DSpace images from Dockerhub
```
docker compose -f docker/docker-compose.yml pull
```

## To build DSpace images using code in your branch
```
docker compose -f docker/docker-compose.yml build
```

## To start DSpace (REST and Angular) from your branch

This command provides a quick way to start both the frontend & backend from this single codebase
```
docker compose -p d8 -f docker/docker-compose.yml -f docker/docker-compose-rest.yml up -d
```

Keep in mind, you may also start the backend by cloning the 'DSpace/DSpace' GitHub repository separately. See the next section.


## Run DSpace REST and DSpace Angular from local branches.

This section assumes that you have clones *both* the 'DSpace/DSpace' and 'DSpace/dspace-angular' GitHub
repositories. When both are available locally, you can spin up both in Docker and have them work together.

_The system will be started in 2 steps. Each step shares the same docker network._

From 'DSpace/DSpace' clone (build first as needed):
```
docker compose -p d8 up -d
```

NOTE: More detailed instructions on starting the backend via Docker can be found in the [Docker Compose instructions for the Backend](https://github.com/DSpace/DSpace/blob/main/dspace/src/main/docker-compose/README.md).

From 'DSpace/dspace-angular' clone (build first as needed)
```
docker compose -p d8 -f docker/docker-compose.yml up -d
```

At this point, you should be able to access the UI from http://localhost:4000,
and the backend at http://localhost:8080/server/

## Run DSpace Angular dist build with DSpace Demo site backend

This allows you to run the Angular UI in *production* mode, pointing it at the demo or sandbox backend
(https://demo.dspace.org/server/ or https://sandbox.dspace.org/server/).

```
docker compose -f docker/docker-compose-dist.yml pull
docker compose -f docker/docker-compose-dist.yml build
docker compose -p d8 -f docker/docker-compose-dist.yml up -d
```

## Ingest test data from AIPDIR

Create an administrator
```
docker compose -p d8 -f docker/cli.yml run --rm dspace-cli create-administrator -e test@test.edu -f admin -l user -p admin -c en
```

Load content from AIP files
```
docker compose -p d8 -f docker/cli.yml -f ./docker/cli.ingest.yml run --rm dspace-cli
```

## Alternative Ingest - Use Entities dataset
_Delete your docker volumes or use a unique project (-p) name_

Start DSpace with Database Content from a database dump
```
docker compose -p d8 -f docker/docker-compose.yml -f docker/docker-compose-rest.yml -f docker/db.entities.yml up -d
```

Load assetstore content and trigger a re-index of the repository
```
docker compose -p d8 -f docker/cli.yml -f docker/cli.assetstore.yml run --rm dspace-cli
```

## End to end testing of the REST API (runs in GitHub Actions CI).
_In this instance, only the REST api runs in Docker using the Entities dataset. GitHub Actions will perform CI testing of Angular using Node to drive the tests.  See `.github/workflows/build.yml` for more details._

This command is only really useful for testing our Continuous Integration process.
```
docker compose -p d8ci -f docker/docker-compose-ci.yml up -d
```
