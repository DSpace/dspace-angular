[![Build Status](https://github.com/DSpace/dspace-angular/workflows/Build/badge.svg?branch=main)](https://github.com/DSpace/dspace-angular/actions?query=workflow%3ABuild) [![Coverage Status](https://codecov.io/gh/DSpace/dspace-angular/branch/main/graph/badge.svg)](https://codecov.io/gh/DSpace/dspace-angular) [![Universal Angular](https://img.shields.io/badge/universal-angular2-brightgreen.svg?style=flat)](https://github.com/angular/universal)

dspace-angular
==============

> The next UI for DSpace 7, based on Angular Universal.

This project is currently under active development. For more information on the DSpace 7 release see the [DSpace 7.0 Release Status wiki page](https://wiki.lyrasis.org/display/DSPACE/DSpace+Release+7.0+Status)

You can find additional information on the DSpace 7 Angular UI on the [wiki](https://wiki.lyrasis.org/display/DSPACE/DSpace+7+-+Angular+UI+Development).


Quick start
-----------

**Ensure you're running [Node](https://nodejs.org) `v12.x` or `v14.x`, [npm](https://www.npmjs.com/) >= `v5.x` and [yarn](https://yarnpkg.com) >= `v1.x`**

```bash
# clone the repo
git clone https://github.com/DSpace/dspace-angular.git

# change directory to our repo
cd dspace-angular

# install the local dependencies
yarn install

# start the server
yarn start
```

Then go to [http://localhost:4000](http://localhost:4000) in your browser

Not sure where to start? watch the training videos linked in the [Introduction to the technology](#introduction-to-the-technology) section below.

Table of Contents
-----------------

-	[Introduction to the technology](#introduction-to-the-technology)
-	[Requirements](#requirements)
-	[Installing](#installing)
    -	[Configuring](#configuring)
-	[Running the app](#running-the-app)
    -	[Running in production mode](#running-in-production-mode)
    - [Deploy](#deploy)
    - [Running the application with Docker](#running-the-application-with-docker)
-	[Cleaning](#cleaning)
-	[Testing](#testing)
    - [Test a Pull Request](#test-a-pull-request)
-	[Documentation](#documentation)
-	[Other commands](#other-commands)
-	[Recommended Editors/IDEs](#recommended-editorsides)
-	[Collaborating](#collaborating)
-	[File Structure](#file-structure)
-	[Managing Dependencies (via yarn)](#managing-dependencies-via-yarn)
-	[Frequently asked questions](#frequently-asked-questions)
-	[License](#license)

Introduction to the technology
------------------------------

You can find more information on the technologies used in this project (Angular.io, Angular CLI, Typescript, Angular Universal, RxJS, etc) on the [LYRASIS wiki](https://wiki.lyrasis.org/display/DSPACE/DSpace+7+UI+Technology+Stack)

Requirements
------------

-	[Node.js](https://nodejs.org) and [yarn](https://yarnpkg.com)
-	Ensure you're running node `v12.x` or `v14.x` and yarn >= `v1.x`

If you have [`nvm`](https://github.com/creationix/nvm#install-script) or [`nvm-windows`](https://github.com/coreybutler/nvm-windows) installed, which is highly recommended, you can run `nvm install --lts && nvm use` to install and start using the latest Node LTS.

Installing
----------

-	`yarn run global` to install the required global dependencies
-	`yarn install` to install the local dependencies

### Configuring

Default configuration file is located in `src/environments/` folder.

To change the default configuration values, create local files that override the parameters you need to change. You can use `environment.template.ts` as a starting point.

-	Create a new `environment.dev.ts` file in `src/environments/` for a `development` environment;
-	Create a new `environment.prod.ts` file in `src/environments/` for a `production` environment;   

The server settings can also be overwritten using an environment file. 

This file should be called `.env` and be placed in the project root.

The following settings can be overwritten in this file:

```bash
DSPACE_HOST # The host name of the angular application
DSPACE_PORT # The port number of the angular application
DSPACE_NAMESPACE # The namespace of the angular application
DSPACE_SSL # Whether the angular application uses SSL [true/false]

DSPACE_REST_HOST # The host name of the REST application
DSPACE_REST_PORT # The port number of the REST application
DSPACE_REST_NAMESPACE # The namespace of the REST application
DSPACE_REST_SSL # Whether the angular REST uses SSL [true/false]
```

The same settings can also be overwritten by setting system environment variables instead, E.g.:
```bash 
export DSPACE_HOST=api7.dspace.org
```

The priority works as follows: **environment variable** overrides **variable in `.env` file** overrides **`environment.(prod, dev or test).ts`** overrides **`environment.common.ts`**

These configuration sources are collected **at build time**, and written to `src/environments/environment.ts`.  At runtime the configuration is fixed, and neither `.env` nor the process' environment will be consulted.

#### Using environment variables in code
To use environment variables in a UI component, use:

```typescript
import { environment } from '../environment.ts';
```

This file is generated by the script located in `scripts/set-env.ts`. This script will run automatically before every build, or can be manually triggered using the appropriate `config` script in `package.json` 


Running the app
---------------

After you have installed all dependencies you can now run the app. Run `yarn run start:dev` to start a local server which will watch for changes, rebuild the code, and reload the server for you. You can visit it at `http://localhost:4000`.

### Running in production mode

When building for production we're using Ahead of Time (AoT) compilation. With AoT, the browser downloads a pre-compiled version of the application, so it can render the application immediately, without waiting to compile the app first. The compiler is roughly half the size of Angular itself, so omitting it dramatically reduces the application payload.

To build the app for production and start the server run:

```bash
yarn start
```
This will run the application in an instance of the Express server, which is included.

If you only want to build for production, without starting, run:

```bash
yarn run build:prod
```
This will build the application and put the result in the `dist` folder.  You can copy this folder to wherever you need it for your application server.  If you will be using the built-in Express server, you'll also need a copy of the `node_modules` folder tucked inside your copy of `dist`.


### Running the application with Docker
See [Docker Runtime Options](docker/README.md)


Cleaning
--------

```bash
# clean everything, including node_modules. You'll need to run yarn install again afterwards.
yarn run clean

# clean files generated by the production build (.ngfactory files, css files, etc)
yarn run clean:prod

# cleans the distribution directory
yarn run clean:dist
```


Testing
-------

### Test a Pull Request

If you would like to contribute by testing a Pull Request (PR), here's how to do so. Keep in mind, you **do not need to have a DSpace backend / REST API installed locally to test a PR**. By default, the dspace-angular project points at our demo REST API

1. Pull down the branch that the Pull Request was built from.  Easy instructions for doing so can be found on the Pull Request itself.
	* Next to the "Merge" button, you'll see a link that says "command line instructions".
	* Click it, and follow "Step 1" of those instructions to checkout the pull down the PR branch.
2. `yarn run clean`  (This resets your local dependencies to ensure you are up-to-date with this PR)
3. `yarn install` (Updates your local dependencies to those in the PR)
4. `yarn start` (Rebuilds the project, and deploys to localhost:4000, by default)
5. At this point, the code from the PR will be deployed to http://localhost:4000.  Test it out, and ensure that it does what is described in the PR (or fixes the bug described in the ticket linked to the PR).

Once you have tested the Pull Request, please add a comment and/or approval to the PR to let us know whether you found it to be successful (or not). Thanks!


### Unit Tests

Unit tests use Karma. You can find the configuration file at the same level of this README file:`./karma.conf.js` If you are going to use a remote test environment you need to edit the `./karma.conf.js`. Follow the instructions you will find inside it. To executing tests whenever any file changes you can modify the 'autoWatch' option to 'true' and 'singleRun' option to 'false'. A coverage report is also available at: http://localhost:9876/ after you run: `yarn run coverage`.

The default browser is Google Chrome.

Place your tests in the same location of the application source code files that they test.

and run: `yarn run test`

### E2E test

E2E tests use Protractor + Selenium server + browsers. You can find the configuration file at the same level of this README file:`./protractor.conf.js` Protractor is installed as 'local' as a dev dependency.

If you are going to use a remote test enviroment you need to edit the './e2e//protractor.conf.js'. Follow the instructions you will find inside it.

The default browser is Google Chrome.

Place your tests at the following path: `./e2e`

and run: `ng e2e`

### Continuous Integration (CI) Test

To run all the tests (e.g.: to run tests with Continuous Integration software) you can execute:`yarn run ci` Keep in mind that this command prerequisites are the sum of unit test and E2E tests.

Documentation
--------------

See [`./docs`](docs) for further documentation.

### Building code documentation

To build the code documentation we use [TYPEDOC](http://typedoc.org). TYPEDOC is a documentation generator for TypeScript projects. It extracts information from properly formatted comments that can be written within the code files. Follow the instructions [here](http://typedoc.org/guides/doccomments/) to know how to make those comments.

Run:`yarn run docs` to produce the documentation that will be available in the 'doc' folder.

Other commands
--------------

There are many more commands in the `scripts` section of `package.json`. Most of these are executed by one of the commands mentioned above.

A command with a name that starts with `pre` or `post` will be executed automatically before or after the script with the matching name. e.g. if you type `yarn run start` the `prestart` script will run first, then the `start` script will trigger.

Recommended Editors/IDEs
------------------------

To get the most out of TypeScript, you'll need a TypeScript-aware editor. We've had good experiences using these editors:

-	Free
	-	[Visual Studio Code](https://code.visualstudio.com/)
		-	[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
	-	[Atom](https://atom.io/)
		-	[TypeScript plugin](https://atom.io/packages/atom-typescript)
-	Paid
	-	[Webstorm](https://www.jetbrains.com/webstorm/download/) or [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)
	-	[Sublime Text](http://www.sublimetext.com/3)
		-	[Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

Collaborating
-------------

See [the guide on the wiki](https://wiki.lyrasis.org/display/DSPACE/DSpace+7+-+Angular+UI+Development#DSpace7-AngularUIDevelopment-Howtocontribute)

File Structure
--------------

```
dspace-angular
├── README.md                                           * This document
├── app.yaml                                            * Application manifest file
├── config                                              * Folder for configuration files
│   ├── environment.default.js                          * Default configuration files
│   └── environment.test.js                             * Test configuration files
├── docs                                                * Folder for documentation
├── e2e                                                 * Folder for e2e test files
│   ├── app.e2e-spec.ts                                 *
│   ├── app.po.ts                                       *
│   ├── pagenotfound                                    *
│   │   ├── pagenotfound.e2e-spec.ts                    *
│   │   └── pagenotfound.po.ts                          *
│   └── tsconfig.json                                   * TypeScript configuration file for e2e tests
├── karma.conf.js                                       * Karma configuration file for Unit Test
├── nodemon.json                                        * Nodemon (https://nodemon.io/) configuration
├── package.json                                        * This file describes the npm package for this project, its dependencies, scripts, etc.
├── postcss.config.js                                   * PostCSS (http://postcss.org/) configuration file
├── protractor.conf.js                                  *
├── resources                                           * Folder for static resources
│   ├── data                                            * Folder for static data
│   │   └── en                                          * Folder for i18n English data
│   ├── i18n                                            * Folder for i18n translations
│   │   └── en.json                                     * i18n translations for English
│   └── images                                          * Folder for images
│       ├── dspace-logo-old.png                         *
│       ├── dspace-logo.png                             *
│       └── favicon.ico                                 *
├── rollup.config.js                                    * Rollup (http://rollupjs.org/) configuration
├── spec-bundle.js                                      *
├── src                                                 * The source of the application
│   ├── app                                             *
│   │   ├── app-routing.module.ts                       *
│   │   ├── app.component.html                          *
│   │   ├── app.component.scss                          *
│   │   ├── app.component.spec.ts                       *
│   │   ├── app.component.ts                            *
│   │   ├── app.effects.ts                              *
│   │   ├── app.module.ts                               *
│   │   ├── app.reducer.ts                              *
│   │   ├── browser-app.module.ts                       * The root module for the client
│   │   ├── +collection-page                            * Lazily loaded route for collection module
│   │   ├── +community-page                             * Lazily loaded route for community module
│   │   ├── core                                        *
│   │   ├── header                                      *
│   │   ├── +home                                       * Lazily loaded route for home module
│   │   ├── +item-page                                  * Lazily loaded route for item module
│   │   ├── object-list                                 *
│   │   ├── pagenotfound                                *
│   │   ├── server-app.module.ts                        * The root module for the server
│   │   ├── shared                                      *
│   │   ├── store.actions.ts                            *
│   │   ├── store.effects.ts                            *
│   │   ├── thumbnail                                   *
│   │   └── typings.d.ts                                * File that allows you to add custom typings for libraries without TypeScript support
│   ├── backend                                         * Folder containing a mock of the REST API, hosted by the express server
│   │   ├── api.ts                                      *
│   │   ├── cache.ts                                    *
│   │   ├── data                                        *
│   │   └── db.ts                                       *
│   ├── config                                          *
│   │   ├── cache-config.interface.ts                   *
│   │   ├── config.interface.ts                         *
│   │   ├── global-config.interface.ts                  *
│   │   ├── server-config.interface.ts                  *
│   │   └── universal-config.interface.ts               *
│   ├── config.ts                                       * File that loads environmental and shareable settings and makes them available to app components
│   ├── index.csr.html                                  * The index file for client side rendering fallback
│   ├── index.html                                      * The index file
│   ├── main.browser.ts                                 * The bootstrap file for the client
│   ├── main.server.ts                                  * The express (http://expressjs.com/) config and bootstrap file for the server
│   ├── modules                                         *
│   │   ├── cookies                                     *
│   │   ├── data-loader                                 *
│   │   ├── transfer-http                               *
│   │   ├── transfer-state                              *
│   │   ├── transfer-store                              *
│   │   └── translate-universal-loader.ts               *
│   ├── routes.ts                                       * The routes file for the server
│   ├── styles                                          * Folder containing global styles
│   │   ├── _mixins.scss                                *
│   │   └── variables.scss                              * Global sass variables file
│   ├── tsconfig.browser.json                           * TypeScript config for the client build
│   ├── tsconfig.server.json                            * TypeScript config for the server build
│   └── tsconfig.test.json                              * TypeScript config for the test build
├── tsconfig.json                                       * TypeScript config
├── tslint.json                                         * TSLint (https://palantir.github.io/tslint/) configuration
├── typedoc.json                                        * TYPEDOC configuration
├── webpack                                             * Webpack (https://webpack.github.io/) config directory
│   ├── webpack.aot.js                                  * Webpack (https://webpack.github.io/) config for AoT build
│   ├── webpack.client.js                               * Webpack (https://webpack.github.io/) config for client build
│   ├── webpack.common.js                               *
│   ├── webpack.prod.js                                 * Webpack (https://webpack.github.io/) config for production build
│   ├── webpack.server.js                               * Webpack (https://webpack.github.io/) config for server build
│   └── webpack.test.js                                 * Webpack (https://webpack.github.io/) config for test build
├── webpack.config.ts                                   *
└── yarn.lock                                           * Yarn lockfile (https://yarnpkg.com/en/docs/yarn-lock)
```

Managing Dependencies (via yarn)
-------------

This project makes use of [`yarn`](https://yarnpkg.com/en/) to ensure that the exact same dependency versions are used every time you install it.

* `yarn` creates a [`yarn.lock`](https://yarnpkg.com/en/docs/yarn-lock) to track those versions. That file is updated automatically by whenever dependencies are added/updated/removed via yarn.
* **Adding new dependencies**: To install/add a new dependency (third party library), use [`yarn add`](https://yarnpkg.com/en/docs/cli/add). For example: `yarn add some-lib`.
    * If you are adding a new build tool dependency (to `devDependencies`), use `yarn add some-lib --dev`
* **Upgrading existing dependencies**: To upgrade existing dependencies, you can use [`yarn upgrade`](https://yarnpkg.com/en/docs/cli/upgrade).  For example: `yarn upgrade some-lib` or `yarn upgrade some-lib@version`
* **Removing dependencies**: If a dependency is no longer needed, or replaced, use [`yarn remove`](https://yarnpkg.com/en/docs/cli/remove) to remove it.

As you can see above, using `yarn` commandline tools means that you should never need to modify the `package.json` manually. *We recommend always using `yarn` to keep dependencies updated / in sync.*

### Adding Typings for libraries

If the library does not include typings, you can install them using yarn:

```bash
yarn add d3
yarn add @types/d3 --dev
```

If the library doesn't have typings available at `@types/`, you can still use it by manually adding typings for it:

1.	In `src/typings.d.ts`, add the following code:

	```typescript
	  declare module 'typeless-package';
	```

2.	Then, in the component or file that uses the library, add the following code:

	```typescript
	  import * as typelessPackage from 'typeless-package';
	  typelessPackage.method();
	```

Done. Note: you might need or find useful to define more typings for the library that you're trying to use.

If you're importing a module that uses CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

Frequently asked questions
--------------------------

-	Why is my service, aka provider, is not injecting a parameter correctly?
	-	Please use `@Injectable()` for your service for typescript to correctly attach the metadata
-	Where do I write my tests?
	-	You can write your tests next to your component files. e.g. for `src/app/home/home.component.ts` call it `src/app/home/home.component.spec.ts`
-	How do I start the app when I get `EACCES` and `EADDRINUSE` errors?
	-	The `EADDRINUSE` error means the port `4000` is currently being used and `EACCES` is lack of permission to build files to `./dist/`
-	What are the naming conventions for Angular 2?
	-	See [the official angular 2 style guide](https://angular.io/styleguide)
-	Why is the size of my app larger in development?
	-	The production build uses a whole host of techniques (ahead-of-time compilation, rollup to remove unreachable code, minification, etc.) to reduce the size, that aren't used during development in the intrest of build speed.
-	node-pre-gyp ERR in yarn install (Windows)
	-	install Python x86 version between 2.5 and 3.0 on windows. See [this issue](https://github.com/AngularClass/angular2-webpack-starter/issues/626)
-	How do I handle merge conflicts in yarn.lock?
	-	first check out the yarn.lock file from the branch you're merging in to yours: e.g. `git checkout --theirs yarn.lock`
	-	now run `yarn install` again. Yarn will create a new lockfile that contains both sets of changes.
	-	then run `git add yarn.lock` to stage the lockfile for commit
	-	and `git commit` to conclude the merge

License
-------
This project's source code is made available under the DSpace BSD License: http://www.dspace.org/license
