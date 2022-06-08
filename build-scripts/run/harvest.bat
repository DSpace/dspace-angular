IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.default

:: wiki: https://wiki.lyrasis.org/display/DSDOC7x/OAI#OAI-HarvestingfromanotherDSpace
pushd ..\..
:: import community with collection
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml -v build-scripts/run/dump:/dump run --rm dspace-cli structure-builder -f /dump/communityCollection.xml -o output.xml -e test@test.edu
:: test connection
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli harvest -g -a http://lindat.mff.cuni.cz/repository/oai/request -i hdl_11234_3430
:: set up collection for harvesting
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli harvest -s -c 123456789/2 -a http://lindat.mff.cuni.cz/repository/oai/request -i hdl_11234_3430 -m dc -t 1 -e test@test.edu
:: start harvesting
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli harvest -r -c 123456789/2 -a http://lindat.mff.cuni.cz/repository/oai/request -i hdl_11234_3430 -m dc -t 1 -e test@test.edu
popd
