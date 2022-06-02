IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.env

pushd ..\..
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/docker-compose.yml pull dspace-angular
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/docker-compose.yml up -d --force-recreate --no-build dspace-angular
popd

IF "%1"=="nopause" GOTO No1
    echo %~n0
    pause
:No1