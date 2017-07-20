/**
 * This file should be temporary
 * See https://github.com/angular/angular-cli/pull/5194
 */
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';

import * as fs from 'fs';
import * as pem from 'pem';
import * as https from 'https';
import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import { enableProdMode } from '@angular/core';

import { ServerAppModuleNgFactory } from './aot/app/server-app.module.ngfactory';
import { ngExpressEngine } from '@nguniversal/express-engine';

import { serverApi, createMockApi } from './backend/api';

import { ROUTES } from './routes';
import { ENV_CONFIG } from './config';

const app = express();

const port = ENV_CONFIG.ui.port ? ENV_CONFIG.ui.port : 80;

if (ENV_CONFIG.production) {
  // TODO: set config for morgan.log location
  const accessLogStream = fs.createWriteStream(ENV_CONFIG.logDirectory + '/morgan.log', { flags: 'a' });

  enableProdMode();
  app.use(compression());

  app.use(morgan('common', {
    skip: (req, res) => res.statusCode < 400,
    stream: accessLogStream
  }));
} else {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(bodyParser.json());

app.engine('html', ngExpressEngine({
  bootstrap: ServerAppModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', 'src');

function cacheControl(req, res, next) {
  // instruct browser to revalidate
  res.header('Cache-Control', ENV_CONFIG.cache.control || 'max-age=60');
  next();
}

app.use('/', cacheControl, express.static('dist', { index: false }));

// TODO: either remove or update mock backend
// app.get('/data.json', serverApi);
// app.use('/api', createMockApi());

function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.csr.html', { root: './src' });
  }

  if (ENV_CONFIG.universal.preboot) {
    Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
      res.render('../dist/index', {
        req,
        res,
        preboot: ENV_CONFIG.universal.preboot,
        async: ENV_CONFIG.universal.async,
        time: ENV_CONFIG.universal.time,
        baseUrl: ENV_CONFIG.ui.nameSpace,
        originUrl: ENV_CONFIG.ui.baseUrl,
        requestUrl: req.originalUrl
      });
    });
  } else {
    console.log('Universal off, serving for direct CSR');
    res.sendFile('index.csr.html', { root: './src' });
  }
}

ROUTES.forEach((route: string) => {
  app.get(route, ngApp);
});

function serverStarted() {
  console.log(`[${new Date().toTimeString()}] Listening at ${ENV_CONFIG.ui.baseUrl}`);
}

function createHttpsServer(keys) {
  https.createServer({
    key: keys.serviceKey,
    cert: keys.certificate
  }, app).listen(port, ENV_CONFIG.ui.host, () => {
    serverStarted();
  });
}

if (ENV_CONFIG.ui.ssl) {
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
  app.listen(port, ENV_CONFIG.ui.host, () => {
    serverStarted();
  });
}
