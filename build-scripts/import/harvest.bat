IF "%ENVFILE%"=="" set ENVFILE=%cd%/envs/.default

:: wiki: https://wiki.lyrasis.org/display/DSDOC7x/OAI#OAI-HarvestingfromanotherDSpace
pushd ..\..
:: import community with collection
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml -v build-scripts/import/assets:/assets run --rm dspace-cli structure-builder -f /assets/test_community_collection.xml -o /assets/test_import_output.xml -e test@test.edu
:: test connection
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli harvest -g -a http://lindat.mff.cuni.cz/repository/oai/request -i hdl_11234_3430
:: set up collection for harvesting
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli harvest -s -c 123456789/2 -a http://lindat.mff.cuni.cz/repository/oai/request -i hdl_11234_3430 -m dc -t 1 -e test@test.edu
:: start harvesting
docker-compose --env-file %ENVFILE% -p dq-d7 -f docker/cli.yml run --rm dspace-cli harvest -r -c 123456789/2 -a http://lindat.mff.cuni.cz/repository/oai/request -i hdl_11234_3430 -m dc -t 1 -e test@test.edu
popd
