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

/* eslint-disable import/no-namespace */
import * as morgan from 'morgan';
import * as express from 'express';
import * as ejs from 'ejs';
import * as compression from 'compression';
import * as expressStaticGzip from 'express-static-gzip';
/* eslint-enable import/no-namespace */

import axios from 'axios';
import LRU from 'lru-cache';
import { createCertificate } from 'pem';
import { createServer } from 'https';
import { json } from 'body-parser';

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { environment } from './src/environments/environment';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { hasNoValue, hasValue } from './src/app/shared/empty.util';

import { UIServerConfig } from './src/config/ui-server-config.interface';

import { ServerAppModule } from './src/main.server';

import { buildAppConfig } from './src/config/config.server';
import { APP_CONFIG, AppConfig } from './src/config/app-config.interface';
import { extendEnvironmentWithAppConfig } from './src/config/config.util';
import { logStartupMessage } from './startup-message';
import { TOKENITEM } from 'src/app/core/auth/models/auth-token-info.model';


/*
 * Set path for the browser application's dist folder
 */
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
// Set path fir IIIF viewer.
const IIIF_VIEWER = join(process.cwd(), 'dist/iiif');

const indexHtml = existsSync(join(DIST_FOLDER, 'index.html')) ? 'index.html' : 'index';

const cookieParser = require('cookie-parser');

const appConfig: AppConfig = buildAppConfig(join(DIST_FOLDER, 'assets/config.json'));

// cache of SSR pages, only enabled in production mode
let cache: LRU<string, any>;

// extend environment with app config for server
extendEnvironmentWithAppConfig(environment, appConfig);

// The Express app is exported so that it can be used by serverless Functions.
export function app() {

  const router = express.Router();

  /*
   * Create a new express application
   */
  const server = express();

  // Tell Express to trust X-FORWARDED-* headers from proxies
  // See https://expressjs.com/en/guide/behind-proxies.html
  server.set('trust proxy', environment.ui.useProxies);

  /*
   * If production mode is enabled in the environment file:
   * - Enable Angular's production mode
   * - Enable caching of SSR rendered pages (if enabled in config.yml)
   * - Enable compression for SSR reponses. See [compression](https://github.com/expressjs/compression)
   */
  if (environment.production) {
    enableProdMode();
    enableCache();
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
   * See [cookie-parser](https://github.com/expressjs/cookie-parser)
   */
  server.use(cookieParser());

  /*
   * Add JSON parser for request bodies
   * See [body-parser](https://github.com/expressjs/body-parser)
   */
  server.use(json());

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

  server.engine('ejs', ejs.renderFile);

  /*
   * Register the view engines for html and ejs
   */
  server.set('view engine', 'html');
  server.set('view engine', 'ejs');

  /**
   * Serve the robots.txt ejs template, filling in the origin variable
   */
  server.get('/robots.txt', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.render('assets/robots.txt.ejs', {
      'origin': req.protocol + '://' + req.headers.host
    });
  });

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
  router.get('*.*', addCacheControl, expressStaticGzip(DIST_FOLDER, {
    index: false,
    enableBrotli: true,
    orderPreference: ['br', 'gzip'],
  }));

  /*
  * Fallthrough to the IIIF viewer (must be included in the build).
  */
  router.use('/iiif', express.static(IIIF_VIEWER, { index: false }));

  /**
   * Checking server status
   */
  server.get('/app/health', healthCheck);

  /**
   * Default sending all incoming requests to ngApp() function, after first checking for a cached
   * copy of the page (see cacheCheck())
   */
  router.get('*', cacheCheck, ngApp);

  server.use(environment.ui.nameSpace, router);

  return server;
}

/*
 * The callback function to serve server side angular
 */
function ngApp(req, res) {
  if (environment.universal.preboot) {
    // Render the page to user via SSR (server side rendering)
    serverSideRender(req, res);
  } else {
    // If preboot is disabled, just serve the client
    console.log('Universal off, serving for direct client-side rendering (CSR)');
    clientSideRender(req, res);
  }
}

/**
 * Render page content on server side using Angular SSR. By default this page content is
 * returned to the user.
 * @param req current request
 * @param res current response
 * @param sendToUser if true (default), send the rendered content to the user.
 * If false, then only save this rendered content to the in-memory cache (to refresh cache).
 */
function serverSideRender(req, res, sendToUser: boolean = true) {
  // Render the page via SSR (server side rendering)
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
      res.locals.ssr = true;  // mark response as SSR (enables text compression)
      // save server side rendered data to cache
      saveToCache(req, data);
      if (sendToUser) {
        // send rendered page to user
        res.send(data);
      }
    } else if (hasValue(err) && err.code === 'ERR_HTTP_HEADERS_SENT') {
      // When this error occurs we can't fall back to CSR because the response has already been
      // sent. These errors occur for various reasons in universal, not all of which are in our
      // control to solve.
      console.warn('Warning [ERR_HTTP_HEADERS_SENT]: Tried to set headers after they were sent to the client');
    } else {
      console.warn('Error in server-side rendering (SSR)');
      if (hasValue(err)) {
        console.warn('Error details : ', err);
      }
      if (sendToUser) {
        console.warn('Falling back to serving direct client-side rendering (CSR).');
        clientSideRender(req, res);
      }
    }
  });
}

/**
 * Send back response to user to trigger direct client-side rendering (CSR)
 * @param req current request
 * @param res current response
 */
function clientSideRender(req, res) {
  res.render(indexHtml, {
    req,
    providers: [{
      provide: APP_BASE_HREF,
      useValue: req.baseUrl
    }]
  });
}


/*
 * Adds a Cache-Control HTTP header to the response.
 * The cache control value can be configured in the config.*.yml file
 * Defaults to max-age=604,800 seconds (1 week)
 */
function addCacheControl(req, res, next) {
  // instruct browser to revalidate
  res.header('Cache-Control', environment.cache.control || 'max-age=604800');
  next();
}

/*
 * Enable server-side caching of pages rendered via SSR.
 */
function enableCache() {
  if (cacheEnabled()) {
    // Initialize a new "least-recently-used" item cache (where least recently used items are removed first)
    // See https://www.npmjs.com/package/lru-cache
    cache = new LRU( {
      max: environment.cache.serverSide.max || 100,            // 100 items in cache maximum
      ttl: environment.cache.serverSide.timeToLive || 15 * 60 * 1000, // 15 minute cache
      allowStale: true // If object is found to be stale, return stale value before deleting
    });
  }
}

/**
 * Return whether server side caching is enabled in configuration.
 */
function cacheEnabled(): boolean {
  // Caching is only enabled is SSR is enabled AND
  // "serverSide.max" setting is greater than zero
  return environment.universal.preboot && environment.cache.serverSide.max && (environment.cache.serverSide.max > 0);
}

/**
 * Check if the currently requested page is in our server-side, in-memory cache.
 * Caching is ONLY done for SSR requests. Pages are cached base on their path (e.g. /home or /search?query=test)
 */
function cacheCheck(req, res, next) {
  let cacheHit = false;
  let debug = false; // Enable to see cache hits & re-rendering logs

  // Only check cache if cache enabled & NOT authenticated.
  // NOTE: Authenticated users cannot use the SSR cache. Cached pages only show data available to anonymous users.
  // Only public pages can currently be cached, as the cached data is not user-specific.
  if (cacheEnabled() && !isUserAuthenticated(req)) {
    const key = getCacheKey(req);

    // Check if this page is in our cache
    let cachedCopy = cache.get(key);
    if (cachedCopy) {
      cacheHit = true;
      res.locals.ssr = true;  // mark response as SSR (enables text compression)
      if (debug) { console.log(`CACHE HIT FOR ${key}`); }
      // return page from cache to user
      res.send(cachedCopy);

      // Check if cached copy is expired (in this sitution key will now be gone from cache)
      if (!cache.has(key)) {
        if (debug) { console.log(`CACHE EXPIRED FOR ${key} Re-rendering...`); }
        // Update cached copy by rerendering server-side
        // NOTE: Cached copy was already returned to user above. So, this re-render is just to prepare for next user.
        serverSideRender(req, res, false);
      }

      // Tell Express to skip all other handlers for this path
      // This ensures we don't try to re-render the page since we've already returned the cached copy
      next('router');
    }
  }

  // If nothing found in cache, just continue with next handler
  // (This should send the request on to the handler that rerenders the page via SSR)
  if (!cacheHit) {
    next();
  }
}

/**
 * Create a cache key from the current request.
 * The cache key is the URL path (NOTE: this key will also include any querystring params).
 * E.g. "/home" or "/search?query=test"
 * @param req current request
 * @returns cache key to use for this page
 */
function getCacheKey(req): string {
  // NOTE: this will return the URL path *without* any baseUrl
  return req.url;
}

/**
 * Save data to server side cache, if enabled. If caching is not enabled or user is authenticated, this is a noop
 * @param req current page request
 * @param data page data to save to cache
 */
function saveToCache(req, data: any) {
  // Only cache if caching is enabled and no one is currently authenticated. This means ONLY public pages can be cached.
  // NOTE: It's not safe to save page data to the cache when a user is authenticated. In that situation,
  // the page may include sensitive or user-specific materials. As the cache is shared across all users, it can only contain public info.
  if (cacheEnabled() && !isUserAuthenticated(req)) {
    cache.set(getCacheKey(req), data);
  }
}

/**
 * Whether a user is authenticated or not
 */
function isUserAuthenticated(req): boolean {
  // Check whether our authentication Cookie exists or not
  return req.cookies[TOKENITEM];
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
  createServer({
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
  logStartupMessage(environment);

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

      createCertificate({
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

/*
 * The callback function to serve health check requests
 */
function healthCheck(req, res) {
  const baseUrl = `${environment.rest.baseUrl}${environment.actuators.endpointPath}`;
  axios.get(baseUrl)
    .then((response) => {
      res.status(response.status).send(response.data);
    })
    .catch((error) => {
      res.status(error.response.status).send({
        error: error.message
      });
    });
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
