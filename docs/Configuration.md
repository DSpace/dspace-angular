# Configuration

Default configuration file is located in `src/environments/` folder. All configuration options should be listed in the default configuration file `src/environments/environment.common.ts`. Please do not change this file directly! To change the default configuration values, create local files that override the parameters you need to change. You can use `environment.template.ts` as a starting point.

-	Create a new `environment.dev.ts` file in `src/environments/` for `development` environment;
-	Create a new `environment.prod.ts` file in `src/environments/` for `production` environment;

Some few configuration options can be overridden by setting environment variables. These and the variable names are listed below.

## Nodejs server
When you start dspace-angular on node, it spins up an http server on which it listens for incoming connections. You can define the ip address and port the server should bind itsself to, and if ssl should be enabled not. By default it listens on `localhost:4000`. If you want it to listen on all your network connections, configure it to bind itself to `0.0.0.0`.

To change this configuration, change the options `ui.host`, `ui.port` and `ui.ssl` in the appropriate configuration file (see above):
```
export const environment = {
  // Angular UI settings.
  ui: {
    ssl: false,
    host: 'localhost',
    port: 4000,
    nameSpace: '/'
  }
};
```

Alternately you can set the following environment variables. If any of these are set, it will override all configuration files:
```
  DSPACE_SSL=true
  DSPACE_HOST=localhost
  DSPACE_PORT=4000
  DSPACE_NAMESPACE=/
```

## DSpace's REST endpoint
dspace-angular connects to your DSpace installation by using its REST endpoint. To do so, you have to define the ip address, port and if ssl should be enabled. You can do this in a configuration file (see above) by adding the following options:

```
export const environment = {
  // The REST API server settings.
  rest: {
    ssl: true,
    host: 'api7.dspace.org',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/server'
  }
};
```

Alternately you can set the following environment variables. If any of these are set, it will override all configuration files:
```
  DSPACE_REST_SSL=true
  DSPACE_REST_HOST=api7.dspace.org
  DSPACE_REST_PORT=443
  DSPACE_REST_NAMESPACE=/server
```

## Supporting analytics services other than Google Analytics
This project makes use of [Angulartics](https://angulartics.github.io/angulartics2/) to track usage events and send them to Google Analytics. 

Angulartics can be configured to work with a number of other services besides Google Analytics as well, e.g. [Piwik](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/piwik), [Google Tag Manager](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/gtm), or [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) to name a few.

In order to start using one of these services, select it from the [Angulartics Providers page](https://angulartics.github.io/angulartics2/#providers), and follow the instructions on how to configure it.

The Google Analytics script was added in [`main.browser.ts`](https://github.com/DSpace/dspace-angular/blob/ff04760f4af91ac3e7add5e7424a46cb2439e874/src/main.browser.ts#L33) instead of the `<head>` tag in `index.html` to ensure events get sent when the page is shown in a client's browser, and not when it's rendered on the universal server. Likely you'll want to do the same when adding a new service.

