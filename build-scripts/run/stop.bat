IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.default

pushd ..\..
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/docker-compose.yml -f docker/docker-compose-rest.yml down
popd

pause
