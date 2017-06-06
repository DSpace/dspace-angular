// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import 'angular2-universal-polyfills';
import 'ts-helpers';
import './platform/workarounds/__workaround.node'; // temporary until 2.1.1 things are patched in Core

import * as path from 'path';
import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { MainModule } from './platform/modules/node.module';

// Routes
import { routes } from './server.routes';

import { EnvConfig } from './config';

if (EnvConfig.production) {
  // enable prod for faster renders
  enableProdMode();
}

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

// Express View
app.engine('.html', createEngine({
  ngModule: MainModule,
  providers: [
    // use only if you have shared state between users
    // { provide: 'LRU', useFactory: () => new LRU(10) }

    // stateless providers only since it's shared
  ]
}));

app.set('port', process.env.PORT || EnvConfig.ui.port || 3000);
app.set('address', process.env.ADDRESS || EnvConfig.ui.address || '127.0.0.1');
app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(compression());

app.use(morgan('dev'));

function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', EnvConfig.cache.control || 'max-age=60');
  next();
}

// Serve static files
app.use('/assets', cacheControl, express.static(path.join(__dirname, 'assets'), { maxAge: 30 }));
app.use('/styles', cacheControl, express.static(path.join(__dirname, 'styles'), { maxAge: 30 }));

app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), { index: false }));

/////////////////////////
// ** Example API
// Notice API should be in aseparate process
import { serverApi, createMockApi } from './backend/api';
// Our API for demos only
app.get('/data.json', serverApi);
app.use('/api', createMockApi());

function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', { root: './src' });
  }

  if (EnvConfig.universal.preboot) {
    Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
      res.render('index', {
        req,
        res,
        // time: true, // use this to determine what part of your app is slow only in development
        async: EnvConfig.universal.async,
        preboot: EnvConfig.universal.preboot,
        baseUrl: EnvConfig.ui.nameSpace,
        requestUrl: req.originalUrl,
        originUrl: EnvConfig.ui.baseUrl
      });
    });
  }
  else {
    res.sendFile('index.html', { root: './src' });
  }
}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(app.get('port'), app.get('address'), () => {
  console.log(`[${new Date().toTimeString()}] Listening on ${EnvConfig.ui.ssl ? 'https://' : 'http://'}${server.address().address}:${server.address().port}`);
});
