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

import 'reflect-metadata';
import 'rxjs';

import * as fs from 'fs';
import * as pem from 'pem';
import * as https from 'https';
import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

import { enableProdMode, NgModuleFactory, Type } from '@angular/core';

import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { environment } from './src/environments/environment';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { hasValue, hasNoValue } from './src/app/shared/empty.util';

/*
 * Set path for the browser application's dist folder
 */
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { ServerAppModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('./dist/server/main');

/*
 * Create a new express application
 */
const app = express();

/*
 * If production mode is enabled in the environment file:
 * - Enable Angular's production mode
 * - Enable compression for response bodies. See [compression](https://github.com/expressjs/compression)
 */
if (environment.production) {
  enableProdMode();
  app.use(compression());
}

/*
 * Enable request logging
 * See [morgan](https://github.com/expressjs/morgan)
 */
app.use(morgan('dev'));

/*
 * Add cookie parser middleware
 * See [morgan](https://github.com/expressjs/cookie-parser)
 */
app.use(cookieParser());

/*
 * Add parser for request bodies
 * See [morgan](https://github.com/expressjs/body-parser)
 */
app.use(bodyParser.json());

/*
 * Render html pages by running angular server side
 */
app.engine('html', (_, options, callback) =>
  ngExpressEngine({
    bootstrap: ServerAppModuleNgFactory,
    providers: [
      {
        provide: REQUEST,
        useValue: (options as any).req,
      },
      {
        provide: RESPONSE,
        useValue: (options as any).req.res,
      },
      provideModuleMap(LAZY_MODULE_MAP)
    ],
  })(_, (options as any), callback)
);

/*
 * Register the view engines for html and ejs
 */
app.set('view engine', 'html');

/*
 * Set views folder path to directory where template files are stored
 */
app.set('views', DIST_FOLDER);

/**
 * Proxy the sitemaps
 */
app.use('/sitemap**', createProxyMiddleware({ target: `${environment.rest.baseUrl}/sitemaps`, changeOrigin: true }));

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
 * Serve static resources (images, i18n messages, …)
 */
app.get('*.*', cacheControl, express.static(DIST_FOLDER, { index: false }));

/*
 * The callback function to serve server side angular
 */
function ngApp(req, res) {
  if (environment.universal.preboot) {
    res.render(DIST_FOLDER + '/index.html', {
      req,
      res,
      preboot: environment.universal.preboot,
      async: environment.universal.async,
      time: environment.universal.time,
      baseUrl: environment.ui.nameSpace,
      originUrl: environment.ui.baseUrl,
      requestUrl: req.originalUrl
    }, (err, data) => {
      if (hasNoValue(err) && hasValue(data)) {
        res.send(data);
      } else {
        console.warn('Error in SSR, serving for direct CSR.');
        if (hasValue(err)) {
          console.warn('Error details : ', err);
        }
        res.sendFile(DIST_FOLDER + '/index.html');
      }
    })
  } else {
    // If preboot is disabled, just serve the client
    console.log('Universal off, serving for direct CSR');
    res.sendFile(DIST_FOLDER + '/index.html');
  }
}

// Register the ngApp callback function to handle incoming requests
app.get('*', ngApp);

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

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    pem.createCertificate({
      days: 1,
      selfSigned: true
    }, (error, keys) => {
      createHttpsServer(keys);
    });
  }
} else {
  app.listen(environment.ui.port, environment.ui.host, () => {
    serverStarted();
  });
}
