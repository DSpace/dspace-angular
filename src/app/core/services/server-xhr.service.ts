/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { XhrFactory } from '@angular/common';
import { Injectable } from '@angular/core';
import { Agent as HttpAgent, AgentOptions as HttpAgentOptions } from 'http';
import { Agent as HttpsAgent } from 'https';
import { XMLHttpRequest } from 'xhr2';

/**
 * Allow HTTP sessions to be kept alive.
 * Without this configuration, Angular re-connects to REST multiple times per SSR cycle.
 * https://nodejs.org/api/http.html#new-agentoptions
 */
const agentOptions: HttpAgentOptions = {
  keepAlive: true,
  keepAliveMsecs: 60 * 1000,
};

// Agents need to be reused between requests, otherwise keep-alive doesn't help.
const httpAgent = new HttpAgent(agentOptions);
const httpsAgent = new HttpsAgent(agentOptions);

/**
 * Contructs the XMLHttpRequest instances used for all HttpClient requests.
 * Emulated by https://github.com/pwnall/node-xhr2 on the server.
 * This class overrides the built-in Angular implementation to set additional configuration.
 *
 * Note that this must be provided in ServerAppModule;
 * it doesn't work when added as a Universal engine provider.
 */
@Injectable()
export class ServerXhrService implements XhrFactory {
  build(): XMLHttpRequest {
    const xhr = new XMLHttpRequest();

    // This call is specific to xhr2 and will probably break if we use another library.
    // https://github.com/pwnall/node-xhr2#features
    (xhr as any).nodejsSet({
      httpAgent,
      httpsAgent,
    });

    return xhr;
  }
}
