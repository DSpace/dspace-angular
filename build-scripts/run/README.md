# Run in docker

## Locally

Build local image `dspace-angular`:
```
cd ../..
docker build . -t dspace-angular
```

Start front-end (local `dspace-angular` image) locally, see `.env.local`
```
start.frontend.local.bat
```

Start backend
```
start.backend.bat
```

## With remote images

```
start.bat
```


# Frontend

./Dockerfile -> `yarn run start:dev` -> ./package.json -> nodemon `yarn run serve` -> ts-node `scripts/serve.ts` -> `ng serve`
