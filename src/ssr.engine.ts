/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { StaticProvider } from '@angular/core';
import { ɵCommonEngine as CommonEngine } from '@nguniversal/common/engine';
import { NgSetupOptions } from '@nguniversal/express-engine';
import * as fs from 'fs';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * This holds a cached version of each index used.
 */
const templateCache: { [key: string]: string } = {};

interface RenderOptions extends NgSetupOptions {
  req: FastifyRequest;
  res: FastifyReply;
  url?: string;
  document?: string;
}

/**
 * This is a Fastify engine for handling Angular Applications
 * Based off of the Express engine.
 */
export function ngFastifyEngine(setupOptions: Readonly<NgSetupOptions>) {
  const engine = new CommonEngine(setupOptions.bootstrap, setupOptions.providers);

  return function (filePath: string,
    options: object,
    callback: (err?: Error | null, html?: string) => void) {
    try {
      const renderOptions = { ...options } as RenderOptions;
      if (!setupOptions.bootstrap && !renderOptions.bootstrap) {
        throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
      }

      const req = renderOptions.req;
      const res = renderOptions.res;

      renderOptions.url = renderOptions.url || `${req.protocol}://${(req.headers.host || '')}${req.url}`;
      renderOptions.document = renderOptions.document || getDocument(filePath);

      renderOptions.providers = renderOptions.providers || [];
      renderOptions.providers = renderOptions.providers.concat(getReqResProviders(req, res));

      engine.render(renderOptions)
            .then(html => callback(null, html))
            .catch(callback);
    } catch (err) {
      callback(err);
    }
  };
}

/**
 * Get providers of the request and response
 */
function getReqResProviders(req: FastifyRequest, reply?: FastifyReply): StaticProvider[] {
  const providers: StaticProvider[] = [
    {
      provide: REQUEST,
      useValue: req
    }
  ];
  if (reply) {
    providers.push({
      provide: RESPONSE,
      useValue: reply
    });
  }

  return providers;
}

/**
 * Get the document at the file path
 */
function getDocument(filePath: string): string {
  return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}
