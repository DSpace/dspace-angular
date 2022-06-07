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

import 'zone.js/node';
import 'reflect-metadata';
import 'rxjs';

import * as pem from 'pem';
import * as https from 'https';
import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as expressStaticGzip from 'express-static-gzip';

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { environment } from './src/environments/environment';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { hasValue, hasNoValue } from './src/app/shared/empty.util';

import { UIServerConfig } from './src/config/ui-server-config.interface';

import { ServerAppModule } from './src/main.server';

import { buildAppConfig } from './src/config/config.server';
import { AppConfig, APP_CONFIG } from './src/config/app-config.interface';
import { extendEnvironmentWithAppConfig } from './src/config/config.util';

/*
 * Set path for the browser application's dist folder
 */
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
// Set path fir IIIF viewer.
const IIIF_VIEWER = join(process.cwd(), 'dist/iiif');

const indexHtml = existsSync(join(DIST_FOLDER, 'index.html')) ? 'index.html' : 'index';

const cookieParser = require('cookie-parser');

const appConfig: AppConfig = buildAppConfig(join(DIST_FOLDER, 'assets/config.json'));

// extend environment with app config for server
extendEnvironmentWithAppConfig(environment, appConfig);

// The Express app is exported so that it can be used by serverless Functions.
export function app() {

  const router = express.Router();

  /*
   * Create a new express application
   */
  const server = express();

  /*
   * If production mode is enabled in the environment file:
   * - Enable Angular's production mode
   * - Enable compression for SSR reponses. See [compression](https://github.com/expressjs/compression)
   */
  if (environment.production) {
    enableProdMode();
    server.use(compression({
      // only compress responses we've marked as SSR
      // otherwise, this middleware may compress files we've chosen not to compress via compression-webpack-plugin
      filter: (_, res) => res.locals.ssr,
    }));
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
        {
          provide: APP_CONFIG,
          useValue: environment
        }
      ]
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
  router.use('/sitemap**', createProxyMiddleware({
    target: `${environment.rest.baseUrl}/sitemaps`,
    pathRewrite: path => path.replace(environment.ui.nameSpace, '/'),
    changeOrigin: true
  }));

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
   * Handle pre-compressed files with [express-static-gzip](https://github.com/tkoenig89/express-static-gzip)
   */
  router.get('*.*', cacheControl, expressStaticGzip(DIST_FOLDER, {
    index: false,
    enableBrotli: true,
    orderPreference: ['br', 'gzip'],
  }));

  /*
  * Fallthrough to the IIIF viewer (must be included in the build).
  */
  router.use('/iiif', express.static(IIIF_VIEWER, { index: false }));

  // Register the ngApp callback function to handle incoming requests
  router.get('*', ngApp);

  server.use(environment.ui.nameSpace, router);

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
        res.locals.ssr = true;  // mark response as SSR
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
        res.render(indexHtml, {
          req,
          providers: [{
            provide: APP_BASE_HREF,
            useValue: req.baseUrl
          }]
        });
      }
    });
  } else {
    // If preboot is disabled, just serve the client
    console.log('Universal off, serving for direct CSR');
    res.render(indexHtml, {
      req,
      providers: [{
        provide: APP_BASE_HREF,
        useValue: req.baseUrl
      }]
    });
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

function start() {
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
      serviceKey = readFileSync('./config/ssl/key.pem');
    } catch (e) {
      console.warn('Service key not found at ./config/ssl/key.pem');
    }

    let certificate;
    try {
      certificate = readFileSync('./config/ssl/cert.pem');
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
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  start();
}

export * from './src/main.server';
