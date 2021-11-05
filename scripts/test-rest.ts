import * as http from 'http';
import * as https from 'https';
import { environment } from '../src/environments/environment';

/**
 * Script to test the connection with the configured REST API (in the 'rest' settings of your environment.*.ts)
 *
 * This script is useful to test for any Node.js connection issues with your REST API.
 *
 * Usage (see package.json): yarn test:rest-api
 */

// Get root URL of configured REST API
const restUrl = environment.rest.baseUrl + '/api';
console.log(`...Testing connection to REST API at ${restUrl}...\n`);

// If SSL enabled, test via HTTPS, else via HTTP
if (environment.rest.ssl) {
    const req = https.request(restUrl, (res) => {
        console.log(`RESPONSE: ${res.statusCode} ${res.statusMessage} \n`);
        res.on('data', (data) => {
            checkJSONResponse(data);
        });
    });

    req.on('error', error => {
        console.error('ERROR connecting to REST API\n' + error);
    });

    req.end();
} else {
    const req = http.request(restUrl, (res) => {
        console.log(`RESPONSE: ${res.statusCode} ${res.statusMessage} \n`);
        res.on('data', (data) => {
            checkJSONResponse(data);
        });
    });

    req.on('error', error => {
        console.error('ERROR connecting to REST API\n' + error);
    });

    req.end();
}

/**
 * Check JSON response from REST API to see if it looks valid. Log useful information
 * @param responseData response data
 */
function checkJSONResponse(responseData: any): any {
    let parsedData;
    try {
        parsedData = JSON.parse(responseData);
        console.log('Checking JSON returned for validity...');
        console.log(`\t"dspaceVersion" = ${parsedData.dspaceVersion}`);
        console.log(`\t"dspaceUI" = ${parsedData.dspaceUI}`);
        console.log(`\t"dspaceServer" = ${parsedData.dspaceServer}`);
        console.log(`\t"dspaceServer" property matches UI's "rest" config? ${(parsedData.dspaceServer === environment.rest.baseUrl)}`);
        // Check for "authn" and "sites" in "_links" section as they should always exist (even if no data)!
        const linksFound: string[] = Object.keys(parsedData._links);
        console.log(`\tDoes "/api" endpoint have HAL links ("_links" section)? ${linksFound.includes('authn') && linksFound.includes('sites')}`);
    } catch (err) {
        console.error('ERROR: INVALID DSPACE REST API! Response is not valid JSON!');
        console.error(`Response returned:\n${responseData}`);
    }
}
