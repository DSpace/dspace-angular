IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.default

pushd ..\..
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/docker-compose.yml -f docker/docker-compose-rest.yml logs -f -t
popd

IF "%1"=="nopause" GOTO No1
    echo %~n0
    pause
:No1