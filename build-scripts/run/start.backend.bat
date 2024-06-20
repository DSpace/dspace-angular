IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.default

pushd ..\..
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/docker-compose-rest.yml pull dspace dspacesolr dspacedb
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/docker-compose-rest.yml up -d --force-recreate --no-build dspace dspacesolr dspacedb
popd

IF "%1"=="nopause" GOTO No1
    echo %~n0
    pause
:No1