# Docker Compose files

## root directory
- docker-compose.yml
  - Starts DSpace Angular with Docker Compose from the current branch.  This file assumes that a DSpace 7 REST instance will also be started in Docker.

## docker directory
- docker-compose-rest.yml
  - Runs a published instance of the DSpace 7 REST API - persists data in Docker volumes
- docker-compose-travis.yml
  - Runs a published instance of the DSpace 7 REST API for CI testing.  The database is re-populated from a SQL dump on each startup.
- cli.yml
  - Docker compose file that provides a DSpace CLI container to work with a running DSpace REST container.
- cli.assetstore.yml
  - Docker compose file that will download and install data into a DSpace REST assetstore.  This script points to a default dataset that will be utilized for CI testing.
- environment.dev.js
  - Environment file for running DSpace Angular in Docker
- local.cfg
  - Environment file for running the DSpace 7 REST API in Docker.


  ## To start DSpace from your branch using a published images for DSpace REST and DSpace Angular.
  ```
  docker-compose -p d7 -f docker-compose.yml -f docker/docker-compose-rest.yml up -d
  ```

  ## To build DSpace Angular from your branch using a published image for DSpace REST.
  ```
  docker-compose -p d7 -f docker-compose.yml -f docker/docker-compose-rest.yml up --build -d
  ```

  ## To build DSpace REST and DSpace Angular.
  _The system will be started in 2 steps. Each step shares the same docker network._

  From DSpace/DSpace
  ```
  docker-compose -p d7 up --build -d
  ```


  From DSpace/DSpace-angular
  ```
  docker-compose -p d7 up --build -d
  ```

  ## End to end testing of the rest api (runs in travis).
  _In this instance, only the REST api runs in Docker.  Travis will perform CI testing of Angular using Node to drive the tests._


  ```
  docker-compose -p d7ci -f docker/docker-compose-travis.yml up -d
  ```
