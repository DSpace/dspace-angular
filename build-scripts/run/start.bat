REM set DSPACE_REST_HOST=dev-5.pc
REM set REST_URL=http://dev-5.pc:8080/server
REM set UI_URL=http://dev-5.pc/
set DSPACE_REST_IMAGE=dataquest/dspace:dspace-7_x
set DOCKER_OWNER=dataquest

IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.default

call start.backend.bat nopause
call start.frontend.bat nopause

pushd ..\..
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli create-administrator -e test@test.edu -f admin -l user -p admin -c en
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli version
popd

IF "%1"=="nopause" GOTO No1
    echo %~n0
    pause
:No1