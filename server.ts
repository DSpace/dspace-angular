/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs';

import * as fs from 'fs';
import * as pem from 'pem';
import * as https from 'https';
import { join } from 'path';

import { enableProdMode } from '@angular/core';
import { existsSync } from 'fs';
import { environment } from './src/environments/environment';
import { hasValue, hasNoValue } from './src/app/shared/empty.util';
import { APP_BASE_HREF } from '@angular/common';
import { UIServerConfig } from './src/config/ui-server-config.interface';

import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

/*
 * Set path for the browser application's dist folder
 */
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const indexHtml = existsSync(join(DIST_FOLDER, 'index.html')) ? 'index.html' : 'index';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { ServerAppModule, ngFastifyEngine } = require('./dist/server/main');


// The Express app is exported so that it can be used by serverless Functions.
export function app() {

  /*
   * Create a new Fastify application
   */
  const server: any = Fastify({
    logger: true,
  });

  /*
   * If production mode is enabled in the environment file:
   * - Enable Angular's production mode
   * - Enable compression, see https://github.com/fastify/fastify-compress
   */
  if (environment.production) {
    enableProdMode();
    server.register(require('@fastify/compress'), {
      global: false,  // only compress SSR responses (static files should be pre-compressed)
    });
  }

  /*
   * Add cookie parser plugin
   * See https://github.com/fastify/fastify-cookie
   */
  server.register(require('@fastify/cookie'), {});

  /**
   * Proxy the sitemaps
   * See https://github.com/fastify/fastify-reply-from
   */
  server.register(require('fastify-reply-from'));
  server.all('/sitemap**', (req, res: any) => {
    res.from(environment.rest.baseUrl + '/sitemaps' + req.url, {
      onResponse(req, res, proxiedRes) {
        res.send(proxiedRes);
      }
    })
  });

  /**
   * Checks if the rateLimiter property is present
   * When it is present, the rateLimiter will be enabled. When it is undefined, the rateLimiter will be disabled.
   */
  if (hasValue((environment.ui as UIServerConfig).rateLimiter)) {
    server.register(require('@fastify/rate-limit'), {
      max: (environment.ui as UIServerConfig).rateLimiter.max,
      timeWindow: (environment.ui as UIServerConfig).rateLimiter.windowMs,
    })
  }

  /*
   * Serve static resources (images, i18n messages, …)
   * See https://github.com/fastify/fastify-static
   */
  server.register(require('@fastify/static'), {
    root: DIST_FOLDER,
    index: false,
    preCompressed: true,
    wildcard: false,      // we need a more limited wildcard route
    cacheControl: false,  // we set the Cache-Control header directly, so this needs to be disabled
  });
  server.get('*.*', (req, res: any) => {
    res.header('Cache-Control', environment.cache.control || 'max-age=60')
       .sendFile(req.url);
  });

  /**
   * Serve Angular application
   *   - SSR (if enabled)
   *   - Fall back to CSR
   */
  server.register(async (fastify: FastifyInstance, setupOptions: any) => {
    const render = ngFastifyEngine(setupOptions);

    fastify.decorateReply('render', (filePath, options, callback) => {
      render(filePath, options, callback);
    });

    // Register the ngApp callback function to handle incoming requests
    (fastify as any).get('*', {
        compress: { encodings: ['br', 'gzip'] },
      },
      ngApp
    );
  }, {
    bootstrap: ServerAppModule,
  });

  return server;
}

/*
 * The callback function to serve server side angular
 */
function ngApp(req, res) {
  if (environment.universal.preboot) {
    res.render(join(DIST_FOLDER, 'index.html'), {
      req,
      res,
      preboot: environment.universal.preboot,
      async: environment.universal.async,
      time: environment.universal.time,
      baseUrl: environment.ui.nameSpace,
      originUrl: environment.ui.baseUrl,
      requestUrl: req.originalUrl,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    }, (err, data) => {
      if (hasNoValue(err) && hasValue(data)) {
        res.header('Content-Type', 'text/html; charset=UTF-8')
           .send(data);
      } else if (hasValue(err) && err.code === 'ERR_HTTP_HEADERS_SENT') {
        // When this error occurs we can't fall back to CSR because the response has already been
        // sent. These errors occur for various reasons in universal, not all of which are in our
        // control to solve.
        console.warn('Warning [ERR_HTTP_HEADERS_SENT]: Tried to set headers after they were sent to the client');
      } else {
        console.warn('Error in SSR, serving for direct CSR.');
        if (hasValue(err)) {
          console.warn('Error details : ', err);
        }
        res.sendFile(indexHtml);
      }
    });
  } else {
    // If preboot is disabled, just serve the client
    console.log('Universal off, serving for direct CSR');
    res.sendFile(indexHtml);
  }
}

/*
 * Callback function for when the server has started
 */
function serverStarted() {
  console.log(`[${new Date().toTimeString()}] Listening at ${environment.ui.baseUrl}`);
}

/*
 * Create an HTTPS server with the configured port and host
 * @param keys SSL credentials
 */
function createHttpsServer(keys) {
  https.createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app).listen(environment.ui.port, environment.ui.host, () => {
    serverStarted();
  });
}

function run() {
  const port = environment.ui.port || 4000;
  const host = environment.ui.host || 'localhost';

  // Start up the Node server
  const server = app();
  server.listen(port, host, () => {
    serverStarted();
  });
}

/*
 * If SSL is enabled
 * - Read credentials from configuration files
 * - Call script to start an HTTPS server with these credentials
 * When SSL is disabled
 * - Start an HTTP server on the configured port and host
 */
// todo: Fastify has built-in support for HTTPS, consider porting this bit as well
//       https://www.fastify.io/docs/latest/Reference/HTTP2/#secure-https
if (environment.ui.ssl) {
  let serviceKey;
  try {
    serviceKey = fs.readFileSync('./config/ssl/key.pem');
  } catch (e) {
    console.warn('Service key not found at ./config/ssl/key.pem');
  }

  let certificate;
  try {
    certificate = fs.readFileSync('./config/ssl/cert.pem');
  } catch (e) {
    console.warn('Certificate not found at ./config/ssl/key.pem');
  }

  if (serviceKey && certificate) {
    createHttpsServer({
      serviceKey: serviceKey,
      certificate: certificate
    });
  } else {
    console.warn('Disabling certificate validation and proceeding with a self-signed certificate. If this is a production server, it is recommended that you configure a valid certificate instead.');

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // lgtm[js/disabling-certificate-validation]

    pem.createCertificate({
      days: 1,
      selfSigned: true
    }, (error, keys) => {
      createHttpsServer(keys);
    });
  }
} else {
  run();
}

export * from './src/main.server';
