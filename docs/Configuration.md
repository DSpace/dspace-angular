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
    host: 'dspace7.4science.cloud',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/server'
  }
};
```

Alternately you can set the following environment variables. If any of these are set, it will override all configuration files:
```
  DSPACE_REST_SSL=true
  DSPACE_REST_HOST=dspace7.4science.cloud
  DSPACE_REST_PORT=443
  DSPACE_REST_NAMESPACE=/server
```

## Supporting analytics services other than Google Analytics
This project makes use of [Angulartics](https://angulartics.github.io/angulartics2/) to track usage events and send them to Google Analytics. 

Angulartics can be configured to work with a number of other services besides Google Analytics as well, e.g. [Piwik](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/piwik), [Google Tag Manager](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/gtm), or [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) to name a few.

In order to start using one of these services, select it from the [Angulartics Providers page](https://angulartics.github.io/angulartics2/#providers), and follow the instructions on how to configure it.

The Google Analytics script was added in [`main.browser.ts`](https://github.com/DSpace/dspace-angular/blob/ff04760f4af91ac3e7add5e7424a46cb2439e874/src/main.browser.ts#L33) instead of the `<head>` tag in `index.html` to ensure events get sent when the page is shown in a client's browser, and not when it's rendered on the universal server. Likely you'll want to do the same when adding a new service.

## SEO when hosting REST Api and UI on different servers

Indexers such as Google Scholar require that files are hosted on the same domain as the page that links them. In DSpace 7, Bitstreams are served from the REST server. So if you use different servers for the REST api and the UI you'll want to ensure that Bitstream downloads are proxied through the UI server. 

In order to achieve this we'll need to do two things:
- **Proxy the Bitstream downloads through the UI server.** You'll need to put a webserver such as httpd or nginx in front of the UI server in order to achieve this. [Below](#apache-http-server-config) you'll find a section explaining how to do it in httpd.
- **Update the URLs for Bitstream downloads to match the UI server.** This can be done using a setting in the UI environment file. 

### UI config
If you set the property `rewriteDownloadUrls` to `true` in your `environment.prod.ts` file, the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of any download URL will be replaced by the origin of the UI. This will also happen for the `citation_pdf_url` `<meta>` tag on Item pages.

The app will determine the UI origin currently in use, so the external UI URL doesn't need to be configured anywhere and rewrites will still work if you host the UI from multiple domains.

### Apache HTTP Server config

#### Basics
In order to be able to host bitstreams from the UI Server you'll need to enable mod_proxy and add the following to the httpd config of your UI server:

```
ProxyPassMatch    "/server/api/core/bitstreams/([^/]+)/content" "http://rest.api/server/api/core/bitstreams/$1/content" 
ProxyPassReverse  "/server/api/core/bitstreams/([^/]+)/content" "http://rest.api/server/api/core/bitstreams/$1/content"
```

Replace http://rest.api in with the correct origin for your REST server.

The `ProxyPassMatch` line forwards all requests matching the regular expression for a bitstream download URL to the corresponding path on the REST server

The `ProxyPassReverse` ensures that if the REST server were to return redirect response, httpd would also swap out its hostname for the hostname of the UI before forwarding the response to the client.

#### Using HTTPS
If your REST server uses https, you'll need to enable mod_ssl and ensure `SSLProxyEngine on` is part of your UI server's httpd config as well

If the UI hostname doesn't match the CN in the SSL certificate of the REST server (which is likely if they're on different domains), you'll also need to add the following lines

```
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
```
These are two names for [the same directive](https://httpd.apache.org/docs/trunk/mod/mod_ssl.html#sslproxycheckpeername) that have been used for various versions of httpd, old versions need the former, then some in-between versions need both, and newer versions only need the latter. Keeping them both doesn't harm anything.

So the entire config becomes:

```
SSLProxyEngine on
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
ProxyPassMatch    "/server/api/core/bitstreams/([^/]+)/content" "https://rest.api/server/api/core/bitstreams/$1/content" 
ProxyPassReverse  "/server/api/core/bitstreams/([^/]+)/content" "https://rest.api/server/api/core/bitstreams/$1/content"
```

If you don't want httpd to verify the certificate of the REST server, you can also turn all checks off with the following config:

```
SSLProxyEngine on
SSLProxyVerify none
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
SSLProxyCheckPeerExpire off
ProxyPassMatch    "/server/api/core/bitstreams/([^/]+)/content" "https://rest.api/server/api/core/bitstreams/$1/content" 
ProxyPassReverse  "/server/api/core/bitstreams/([^/]+)/content" "https://rest.api/server/api/core/bitstreams/$1/content"
```





