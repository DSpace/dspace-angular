IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.local

start.frontend.bat nopause

IF "%1"=="nopause" GOTO No1
    echo %~n0
    pause
:No1