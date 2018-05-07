# Configuration

## Supporting analytics services other than Google Analytics
This project makes use of [Angulartics](https://angulartics.github.io/angulartics2/) to track usage events and send them to Google Analytics. 

Angulartics can be configured to work with a number of other services besides Google Analytics as well, e.g. [Piwik](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/piwik), [Google Tag Manager](https://github.com/angulartics/angulartics2/tree/master/src/lib/providers/gtm), or [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) to name a few.

In order to start using one of these services, select it from the [Angulartics Providers page](https://angulartics.github.io/angulartics2/#providers), and follow the instructions on how to configure it.

The Google Analytics script was added in [`main.browser.ts`](https://github.com/DSpace/dspace-angular/blob/ff04760f4af91ac3e7add5e7424a46cb2439e874/src/main.browser.ts#L33) instead of the `<head>` tag in `index.html` to ensure events get sent when the page is shown in a client's browser, and not when it's rendered on the universal server. Likely you'll want to do the same when adding a new service.