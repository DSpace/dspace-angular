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
import * as cookieParser from 'cookie-parser';

import { enableProdMode, NgModuleFactory, Type } from '@angular/core';

import { ngExpressEngine } from '@nguniversal/express-engine';

import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { environment } from './src/environments/environment';

export function startServer(bootstrap: Type<{}> | NgModuleFactory<{}>) {
  const app = express();

  if (environment.production) {
    enableProdMode();
    app.use(compression());
  }

  app.use(morgan('dev'));

  app.use(cookieParser());
  app.use(bodyParser.json());

  app.engine('html', (_, options, callback) =>
    ngExpressEngine({
      bootstrap: bootstrap,
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

  app.set('view engine', 'ejs');
  app.set('view engine', 'html');
  app.set('views', 'src');

  function cacheControl(req, res, next) {
    // instruct browser to revalidate
    res.header('Cache-Control', environment.cache.control || 'max-age=60');
    next();
  }

  app.use('/', cacheControl, express.static('dist', { index: false }));

// TODO: either remove or update mock backend
// app.get('/data.json', serverApi);
// app.use('/api', createMockApi());

  function ngApp(req, res) {
    const dspace = {
      originalRequest: {
        headers: req.headers,
        body: req.body,
        method: req.method,
        params: req.params,
        reportProgress: req.reportProgress,
        withCredentials: req.withCredentials,
        responseType: req.responseType,
        urlWithParams: req.urlWithParams
      }
    };

    function onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
      if (!res._headerSent)  {
        console.warn('Error in SSR, serving for direct CSR. Error details : ', error);
        res.sendFile('index.csr.html', { root: './src' });
      }
    }

    if (environment.universal.preboot) {
      Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
        res.render('../dist/index.html', {
          req,
          res,
          preboot: environment.universal.preboot,
          async: environment.universal.async,
          time: environment.universal.time,
          baseUrl: environment.ui.nameSpace,
          originUrl: environment.ui.baseUrl,
          requestUrl: req.originalUrl
        });
      });
    } else {
      console.log('Universal off, serving for direct CSR');
      res.render('index-csr.ejs', {
        root: './src',
        scripts: `<script>window.dspace = ${JSON.stringify(dspace)}</script>`
      });
    }
  }

  function serverStarted() {
    console.log(`[${new Date().toTimeString()}] Listening at ${environment.ui.baseUrl}`);
  }

  function createHttpsServer(keys) {
    https.createServer({
      key: keys.serviceKey,
      cert: keys.certificate
    }, app).listen(environment.ui.port, environment.ui.host, () => {
      serverStarted();
    });
  }

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
  }}
