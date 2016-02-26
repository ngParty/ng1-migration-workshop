# STEPS

## Step 0 - replace bower with npm

- replace `bower_components` with `../node_modules/` in `index.html`
- replace `app/bower_components` with `node_modules` in `test/karma.conf.js`
- remove bower related files `rm -rf app/bower_components`,`rm .bowerrc bower.json app/.bowerrc`, `npm rm bower -D`
- remove `"postinstall": "bower install"` task from npm scripts
- install packages via npm `npm i -S angular angular-mocks angular-route angular-resource angular-animate jquery bootstrap`

run: 
- `npm start` and check your browser 
- `npm test` and check if tests are passing 


## Step 1 - add typescript

- install typescript `npm i -D typescript`
- add `"tsc:init": "tsc --init"` to npm scripts so we can create *tsconfig.json* from cli
- run `npm run tsc:init`
- update tsconfig.json to
```json
{
 "compilerOptions": {
    "target": "es5",
    "noImplicitAny": false,
    "sourceMap": true,
    "outDir": "ts-output",
    "allowJs": true
  },
  "exclude": [
    "node_modules",   
    "scripts",
    "ts-output"
  ]
}  
```
- replace all custom js paths `js` with `../ts-output/app/js` in index.html
- replace all custom js paths `app/js` and `test/unit` with `ts-output/app/js` and `ts-output/app/js` in `test/karma.conf.js`
- create `clean` npm script :`"clean":"rm -rf ts-output"`
- remove `bower_components/` and add `ts-output` to `.gitignore`
- update `start` npm script to `"start": "npm run clean && tsc && http-server -a 0.0.0.0 -p 8000"`
- now run `npm start`

run: 
- `npm start` and check your browser 
- `npm test` and check if tests are passing

## Step 2 - add typings

- install typings `npm i typings -D`
- add npm script `"typings": "typings"`
- install type definitions for our project
```bash
npm run typings install jquery -- --save --ambient
npm run typings install angular -- --save --ambient
npm run typings install angular-route -- --save --ambient
npm run typings install angular-resource -- --save --ambient
npm run typings install angular-animate -- --save --ambient
npm run typings install angular-mocks -- --save --ambient
npm run typings install jasmine -- --save --ambient
```
- add `typings` to `.gitignore`
- update `tsconfig.json`
```json
{
"exclude": [
    "node_modules",
    "scripts",
    "ts-output",
    "typings/main",
    "typings/main.d.ts"       
  ]
}  
```

## Step 3 - introduce module loader and bundler ( webpack )

- install webpack, it's loaders and dev-server
`npm i -D webpack webpack-dev-server copy-webpack-plugin html-webpack-plugin style-loader css-loader raw-loader ts-loader file-loader url-loader`
- create `webpack.config.js` with content:
```js
const webpack = require( 'webpack' );

const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const ENV = ( process.env.NODE_ENV || 'development' );

const webpackConfigEntryPoints = {
  app: './app/bootstrap.ts'
};

const webpackConfigLoaders = [

  // Scripts
  {
    test: /\.ts$/,
    exclude: [ /node_modules/ ],
    loader: 'ts-loader'
  },

  // Styles
  {
    test: /\.css$/,
    loaders: [ 'style-loader', 'css-loader' ]
  },

  // Fonts
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&minetype=application/font-woff'
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader'
  },

  //HTML
  {
    test: /\.html$/,
    loader: 'raw-loader'
  }

];

const webpackConfigPlugins = [

  new HtmlWebpackPlugin({
    template: 'app/index.html',
    inject: 'body',
    hash: true,
    env: ENV,
    host: '0.0.0.0',
    port: process.env.npm_package_config_port
  }),

  new CopyWebpackPlugin([
    {
      from: 'app/assets',
      to: './'
    }
  ])

];


module.exports = {
  devtool: 'source-map',
  entry: webpackConfigEntryPoints,
  output: {
    path: '/',
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: [ '', '.webpack.js', '.web.js', '.ts', '.js' ]
  },
  watch: true,
  module: {
    loaders: webpackConfigLoaders
  },
  plugins: webpackConfigPlugins
};

```
- replace npm scripts `start` with:
` "start": "webpack-dev-server --port $npm_package_config_port --hot --inline --progress --profile --colors --watch --display-error-details --display-cached --content-base app/"`

- add user config to package.json for server
```json
{
 "config": {
    "port": "9000"
  }
}  
```

- update tsconfig.js be excluding files that we create, which TS should not touch:
```json
{
  "exclude": [
    "node_modules",
    "typings/main",
    "typings/main.d.ts",    
    "scripts",
    "ts-output",
    "webpack.config.js"
  ]
}
```

- remove http-server ( we have now webpack-dev-server)
`npm rm -D http-server`

## Step 4 - load everything via Webpack and es2015 empty imports
  
- create *app/bootstrap.ts* where all files will be loaded via empty imports:
```js
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/app.css';
import './css/animations.css';

import 'jquery';
import 'angular';
import 'angular-route';
import 'angular-resource';
import 'angular-animate';

import './js/core/core.module'
import './js/core/phone.factory'
import './js/core/checkmark.filter'

import './js/phone_detail/phone_detail.module'
import './js/phone_detail/phone_detail.controller'
import './js/phone_detail/phone_detail.component'
import './js/phone_detail/phone.animation'

import './js/phone_list/phone_list.module'
import './js/phone_list/phone_list.controller'
import './js/phone_list/phone_list.component'

import './js/app.module'
```

- remove all script tags and stylesheets from index.html

- run `npm start` and open browser `localhost:9000`


## Step 5 - introduce es2015 modules

> we will convert root App Module
> we will switch to manual angular bootstrap

- update tsconfig.json to
```json
{
 "compilerOptions": {
    "target": "es5",
    "modules": "commonjs",    
    "noImplicitAny": false,
    "sourceMap": true,
    "outDir": "ts-output",
    "allowJs": true
  }
}  
```

- rename `app.module.js` to `app.module.ts`
- import angular and router and remove those from bootstrap.ts:
```typescript
import * as angular from 'angular';
import * as ngRoute from 'angular-route';
```
- use those imports and export our root module:
```typescript
export const PhonecatApp = angular
  .module( 'phonecatApp', [
    ngRoute,
    'phonecat.core',
    'phonecat.phoneList',
    'phonecat.phoneDetail'
  ] )
```
- extract config to separate file `app.config.ts`
 - properly annotate via `$inject`
 - import it back to main module and register with angular container


Now we will update angular bootstraping

- remove `ng-app` from index.html
- import `PhonecatApp` to `bootstrap.ts` and remove empty import
- manually bootstrap via `angular.bootstrap` :
```typescript
document.addEventListener( 'DOMContentLoaded', ()=> {
  angular.bootstrap( document, [ PhonecatApp.name ] );
} );
```

Introduce Typescript types:

- add types for app.config

 
## Step 6 - introduce ngMetadata and start migration from js to ts

- update tsconfig.json to
```json
{
 "compilerOptions": {
    "target": "es5",
    "modules": "commonjs",    
    "noImplicitAny": false,
    "sourceMap": true,
    "outDir": "ts-output",                  
    "allowJs": true,
    "experimentalDecorators": true,
    "moduleResolution": "node"        
  }
}  
```

- install `npm i -S ng-metadata`

- boot app via ngMetadata
```typescript
// app/bootstrap.ts
import { bootstrap } from 'ng-metadata/platform';
import { PhonecatApp } from './js/app.module';
bootstrap( PhonecatApp );
```

## Step 7 - refactor core module
> upgrade order
> 1. module to ts/es2015
> 2. services
> 3. filters(pipes)
> 4. components/directives

#### Upgrade Core Module

- rename `core.module.js` to `core.module.ts`
  - apply TS ng1 module pattern

#### Upgrade Checkmar Filter

- rename `checkmark.filter.js` to `checkmark.pipe.ts` 
  - apply ngMetadata/Angular 2 @Pipe
  - register exported class to CoreModule via `provide`
  
#### Upgrade Phone Factory

- rename `phone.factory.js` to `phone.service.ts` 
  - apply ngMetadata/Angular 2 @Injectable
  - replace obsolete `$resource` with `$http` and update related components which use this service
  - create Phone interface for type support
  - register exported class to CoreModule via `...provide( 'Phone', { useClass: PhoneService } )` 
    - we need to maintain old string injection which are used other modules

#### After

- register refactored CoreModule within PhonecatApp root module
- remove empty imports from `bootstrap`
- remove `ngResource` module


## Step 8 - Bring tests up

#### Config webpack for test and setup Karma

- install `npm i -D karma-sourcemap-loader karma-webpack`

- create `spec.bundle.js` for webpack test bundling 
```js
require('angular');
require('angular-mocks/ngMock');

const testContext = require.context('./app', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
```

- create new karma.conf.js in root

```js
const path = require('path')

const webpackConfig = require('./webpack.config');
const entry = 'spec.bundle.js';

const files = [ { pattern: entry, watched: false } ];

const preprocessors = {
  [entry]: [
    'webpack',
    'sourcemap'
  ]
};
const plugins = [
  require('karma-jasmine'),
  require('karma-chrome-launcher'),
  require('karma-webpack'),
  require('karma-sourcemap-loader')
];
const frameworks = [
  'jasmine'
];

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: frameworks,

    // list of files to exclude
    exclude: [],

    // list of files / patterns to load in the browser
    // we are building the test environment in ./spec-bundle.js
    files: files,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: preprocessors,
    webpack: webpackConfig,

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Timeout for capturing a browser (in ms)
    captureTimeout: 6000,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,

    plugins: plugins
  })
};
```

- change npm scripts for test: 
```
{
  ...
  "test": "NODE_ENV=test karma start karma.conf.js",
  "test:watch": "NODE_ENV=test karma start karma.conf.js --auto-watch --no-single-run",
}
```

- update tsconfig.js be excluding files that we create, which TS should not touch:
```json
{
  "exclude": [
    "node_modules",
    "typings/main",
    "typings/main.d.ts",    
    "scripts",
    "ts-output",
    "webpack.config.js",
    // old tests
    "test",
    // new karma config
    "karma.conf.js",
    // main test bundle - webpack specific
    "spec.bundle.js"    
  ]
}
```

#### Upgrade Checkmark Pipe test

- move `test/unit/checkmark.filter.spec.js` to `app/js/core/checkmark.pipe.spec.ts`
- upgrade test to use only vanilla js/ts no angular needed yo! (Angular 2 style)

#### Upgrade Phone Service test  

- move `test/unit/phone.factory.spec.js` to `app/js/core/phone.service.spec.ts`
- upgrade test to use only vanilla js/ts no angular needed yo! (Angular 2 style)
- additionaly mock $http and check if it gets called

#### End

- run `npm test` and watch it pass!
