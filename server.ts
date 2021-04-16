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
import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { join } from 'path';

import { enableProdMode } from '@angular/core';
import { existsSync } from 'fs';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { environment } from './src/environments/environment';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { hasValue, hasNoValue } from './src/app/shared/empty.util';
import { APP_BASE_HREF } from '@angular/common';
import { UIServerConfig } from './src/config/ui-server-config.interface';

/*
 * Set path for the browser application's dist folder
 */
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
// Set path fir IIIF viewer.
const IIIF_VIEWER = join(process.cwd(), 'dist/iiif');

const indexHtml = existsSync(join(DIST_FOLDER, 'index.html')) ? 'index.html' : 'index';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { ServerAppModule, ngExpressEngine } = require('./dist/server/main');

const cookieParser = require('cookie-parser');

// The Express app is exported so that it can be used by serverless Functions.
export function app() {

  /*
   * Create a new express application
   */
  const server = express();


  /*
   * If production mode is enabled in the environment file:
   * - Enable Angular's production mode
   * - Enable compression for response bodies. See [compression](https://github.com/expressjs/compression)
   */
  if (environment.production) {
    enableProdMode();
    server.use(compression());
  }

  /*
   * Enable request logging
   * See [morgan](https://github.com/expressjs/morgan)
   */
  server.use(morgan('dev'));

  /*
   * Add cookie parser middleware
   * See [morgan](https://github.com/expressjs/cookie-parser)
   */
  server.use(cookieParser());

  /*
   * Add parser for request bodies
   * See [morgan](https://github.com/expressjs/body-parser)
   */
  server.use(bodyParser.json());

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', (_, options, callback) =>
    ngExpressEngine({
      bootstrap: ServerAppModule,
      providers: [
        {
          provide: REQUEST,
          useValue: (options as any).req,
        },
        {
          provide: RESPONSE,
          useValue: (options as any).req.res,
        },
      ],
    })(_, (options as any), callback)
  );

  /*
   * Register the view engines for html and ejs
   */
  server.set('view engine', 'html');

  /*
   * Set views folder path to directory where template files are stored
   */
  server.set('views', DIST_FOLDER);

  /**
   * Proxy the sitemaps
   */
  server.use('/sitemap**', createProxyMiddleware({ target: `${environment.rest.baseUrl}/sitemaps`, changeOrigin: true }));

  /**
   * Checks if the rateLimiter property is present
   * When it is present, the rateLimiter will be enabled. When it is undefined, the rateLimiter will be disabled.
   */
  if (hasValue((environment.ui as UIServerConfig).rateLimiter)) {
    const RateLimit = require('express-rate-limit');
    const limiter = new RateLimit({
      windowMs: (environment.ui as UIServerConfig).rateLimiter.windowMs,
      max: (environment.ui as UIServerConfig).rateLimiter.max
    });
    server.use(limiter);
  }

  /*
   * Serve static resources (images, i18n messages, …)
   */
  server.get('*.*', cacheControl, express.static(DIST_FOLDER, { index: false }));
  /*
  * Fallthrough to the IIIF viewer (must be included in the build).
  */
  server.use('/iiif', express.static(IIIF_VIEWER, {index:false}));

  // Register the ngApp callback function to handle incoming requests
  server.get('*', ngApp);

  return server;
}

/*
 * The callback function to serve server side angular
 */
function ngApp(req, res) {
  if (environment.universal.preboot) {
    res.render(indexHtml, {
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
        res.send(data);
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
        res.sendFile(DIST_FOLDER + '/index.html');
      }
    });
  } else {
    // If preboot is disabled, just serve the client
    console.log('Universal off, serving for direct CSR');
    res.sendFile(DIST_FOLDER + '/index.html');
  }
}

/*
 * Adds a cache control header to the response
 * The cache control value can be configured in the environments file and defaults to max-age=60
 */
function cacheControl(req, res, next) {
  // instruct browser to revalidate
  res.header('Cache-Control', environment.cache.control || 'max-age=60');
  next();
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
  const host = environment.ui.host || '/';

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
