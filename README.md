# ngPartyLabs I. - migrate es5 ng 1.x to typescript + ngMetadata

## Prerequisites

- finished AngularJS Phone Catalog Tutorial Application by following AngulaJS Styleguide (components tree)
- there should be one component per file. This not only makes components easy to navigate and find, but will also allow us to migrate them between languages and frameworks one at a time. 
In this example application, each controller, factory, and filter is in its own source file.
- The Folders-by-Feature Structure and Modularity rules define similar principles on a higher level of abstraction: Different parts of the application should reside in different directories and Angular modules. 

When an application is laid out feature per feature in this way, it can also be migrated one feature at a time. For applications that don't already look like this, applying the rules in the Angular style guide is a highly recommended preparation step. And this is not just for the sake of the upgrade - it is just solid advice in general!

### Git

- [Download](https://git-scm.com/downloads).
- A good place to learn about setting up git is [here](git-github).

### Node.js and Tools

- [Download](https://nodejs.org/).

### Install npm dependencies

- `$ npm i`

### CLI preparation

Run this command to set system path to lookup project npm packages binaries, so you won't need to install anything globally.
 
 ```bash
 echo 'export PATH="./node_modules/.bin:$PATH"' >> ~/.bash_profile
 ```
 
## Commits

Each tagged commit is a separate lesson teaching a single step of refactoring process.

You can check out any point of the tutorial using
    git checkout step-?

To see the changes which between any two lessons use the git diff command.
    git diff step-?..step-?
    
## Step init

Alrighty yo.

Lets clone this repo `git clone https://github.com/ngParty/ng1-migration-workshop`

And reset to inital step: `git checkout -f init`

Now your refactor journey can start! May the ~~`Force`~~`Code` be with you!

## Step 0 - replace bower with npm

Each controller, factory, and filter is in its own source file, as per the Rule of 1.
The `core`, `phoneDetail`, and `phoneList` modules are each in their own subdirectory. 
Those subdirectories contain the JavaScript code as well as the HTML templates that go with each particular feature. 
This is in line with the Folders-by-Feature Structure and Modularity rules.

We will also start to gradually phase out the Bower package manager in favor of NPM. 
We'll install all new dependencies using NPM, and will eventually be able to remove Bower from the project.

- replace `bower_components` with `../node_modules/` in `index.html`
- replace `app/bower_components` with `node_modules` in `test/karma.conf.js`
- remove bower related files `rm -rf app/bower_components`,`rm .bowerrc bower.json app/.bowerrc`, `npm rm bower -D`
- remove `"postinstall": "bower install"` task from npm scripts
- remove `"prestart": "npm i"` task from npm scripts
- install packages via npm `npm i -S angular angular-mocks angular-route angular-resource angular-animate jquery bootstrap`

run: 
- `$ npm start` and check your browser 
- `$ npm test` and check if tests are passing 


## Step 1 - add typescript

- install typescript `$ npm i -D typescript`
- add `"tsc": "tsc -p . -w"` to npm scripts so we can run tsc and start watching for file changes from editor.
- run `$ tsc init` to create `tsconfig.json`
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
- update `start` npm script to `"start": "npm run clean && npm run tsc && http-server -a 0.0.0.0 -p 8000"`

run: 
- `$ npm start` and open your broser at `localhost:8000` check your browser 
- `$ npm test` and check if tests are passing

## Step 2 - add typings

install the Typings type definition manager. 
It will allow us to install type definitions for libraries that don't come with prepackaged types.

- install typings `$ npm i typings -D`
- install type definitions for our project
```bash
$ typings install jquery --save --ambient
$ typings install angular --save --ambient
$ typings install angular-route --save --ambient
$ typings install angular-resource --save --ambient
$ typings install angular-animate --save --ambient
$ typings install angular-mocks --save --ambient
$ typings install jasmine --save --ambient
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
```
$ npm i -D webpack webpack-dev-server copy-webpack-plugin html-webpack-plugin style-loader css-loader raw-loader ts-loader file-loader url-loader
```

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
` "start": "webpack-dev-server --port 9000 --watch --colors --inline --hot --content-base app/"`

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

- remove http-server ( we have now webpack-dev-server) by running `npm rm -D http-server`


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

- run `$ npm start` and open browser http://localhost:9000


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


Now we will switch to a JavaScript-driven bootstrap instead. 
As it happens, this is also how Angular 2 apps are bootstrapped, 
so the switch brings us one step closer to Angular as well.

- remove `ng-app` from index.html
- import `PhonecatApp` to `bootstrap.ts` and remove empty import
- manually bootstrap via `angular.bootstrap` :
```typescript
document.addEventListener( 'DOMContentLoaded', ()=> {
  angular.bootstrap( document, [ PhonecatApp.name ] );
} );
```

Introduce Typescript types:

- add type annotations for app.config

 
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

- install `$ npm i -S ng-metadata`

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
    - we need to maintain old string injection which is used by other modules

#### END

- register refactored CoreModule within PhonecatApp root module
- remove empty imports from `bootstrap`
- remove `ngResource` module


## Step 8 - Bring tests up

#### Config webpack for test and setup Karma

- install `$ npm i -D karma-sourcemap-loader karma-webpack`

- create `spec.bundle.js` for webpack test bundling 
```js
require('angular');
require('angular-mocks/ngMock');

const testContext = require.context('./app', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
```

- create new karma.conf.js in project root

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
  "test": "test karma start karma.conf.js",
  "test:watch": "karma start karma.conf.js --auto-watch --no-single-run",
}
```

- update tsconfig.js by excluding files that we've created, which shouldn't be touched by TS:
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

- run `$ npm test` and watch it pass!


## Step 9 - refactor phone list module

#### Upgrade PhoneList Module

- rename `phone_list.module.js` to `phone-list.module.ts`
  - apply TS ng1 module pattern
- import `CoreModule` and get rid of strings
- import newly TSified `PhoneListModule` to `PhoneCatApp` root module

#### Upgrade PhoneList Component

Next, let's upgrade our Angular 1 controllers to Angular 2 style components via ngMetadata.

Let's look at the phone list controller first. 
Right now it is a ES5 constructor function, which is paired with an HTML template by the route configuration in `app.module.ts`. 

We'll be turning it into an Angular 2 style component.

- rename `phone_list.controller.js` to `phone-list.component.ts` 
- rename `phone_list.html` to `phone-list.html` so we have consisten naming with component file 
- refactor the controller function inside to exported class `PhoneListComponent` and decorate it as a `@Component`

So you should have
```typescript
import { Component } from 'ng-metadata/core';

@Component({
  selector: 'pc-phone-list',
  template: require('./phone-list.html')
})
export class PhoneListComponent{}
```

The `selector` attribute is a CSS selector that defines where on the page the component should go. 
It will match elements by the name of `pc-phone-list`. 
It is a good idea to always use application-specific prefixes in selectors so that they never clash with built-in ones, 
and here we're using `pc-`, which is short for `"PhoneCat"`.

The `template: require('./phone-list.html')` loads static asset(html file) via webpack, in this case that's external HTML template for our component
Thanks to this we have modular component, whe we move it everything is moved togehtr 

Both of these attributes(selector and template) are things, that were defined externally for the controller, but for the component are things that it defines itself. 
This will affect how we use the component in the router.

- we need to define internal component state which consists od 2 props:
```typescript
phones: Phone[];
orderProp: string = 'age';
```

- now we need to add back DI and inject here `PhoneService` via `'Phone'` string ( this is how it's registered in core.module )
- use `@Inject` decorator within constructor as a parameter
```typescript
export class PhoneListComponent{
  
  phones: Phone[];
  orderProp: string = 'age';
  
  constructor(
    @Inject('Phone') private phoneSvc: PhoneService
  ){}
}
```

- last thing we need to get back is to fetch phone service to get all phones
- let's do this in `ngOnInit` life cycle hook ( this is executed from `preLink` in ng1 terms )

```typescript
import { Component, OnInit, Inject } from 'ng-metadata/core';
import { Phones, Phone, PhoneService } from '../core/phone.service';

@Component({
  selector: 'pc-phone-list',
  template: require('./phone_list.html')
})
export class PhoneListComponent implements OnInit{

  phones: Phone[];
  orderProp: string = 'age';

  constructor(
    @Inject('Phone') private phoneSvc: PhoneService
  ){}

  ngOnInit(){

    this.phoneSvc
      .query()
      .then( ( phones ) => this.phones = phones );

  }
}
```

- register the refactored component to angular module `phone-list.module.ts` via `provide`
```typescript
import { provide } from 'ng-metadata/core';

PhoneListModule
  .directive( ...provide(PhoneListComponent) )
```

- remove old `angular-component.js`
- hop to `app.config.ts` and update route template with new `selector` name:
```typescript
$routeProvider
  .when('/phones', {
    template: '<pc-phone-list></pc-phone-list>'
  }).
```

- remove empty imports from `bootstrap.ts`
```
import './js/phone_list/phone-list.module.ts'
import './js/phone_list/phone_list.controller'
import './js/phone_list/phone_list.component'
```

- boom! run the app to check if everything works

#### Upgrade PhoneList Tests

- move `test/unit/phone_list.controller.spec.js` to `app/js/phone_list/phone-list.component.spec.ts`
- upgrade test to use only vanilla js/ts no angular needed yo! (Angular 2 style)
- use `$injector` for injecting angular specific services if you don't wanna mock them
```typescript
  let ctrl: PhoneListComponent;
  let $httpBackend: ng.IHttpBackendService;
  
    beforeEach( angular.mock.inject( ( $injector: ng.auto.IInjectorService ) => {

    const $http = $injector.get<ng.IHttpService>( '$http' );
    const phoneSvc = new PhoneService( $http );

    $httpBackend = $injector.get<ng.IHttpBackendService>( '$httpBackend' );
    $httpBackend
      .expectGET('phones/phones.json')
      .respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

    ctrl = new PhoneListComponent( phoneSvc );

    ctrl.ngOnInit();

  } ) )
```

- run `$ npm test` and watch it pass ;)

## Step 10 - refactor phone detail module

#### Upgrade PhoneDetail Module

- rename `phone_detail.module.js` to `phone-detail.module.ts`
  - apply TS ng1 module pattern
- import `CoreModule` and get rid of strings
- import newly TSified `PhoneDetailModule` to `PhoneCatApp` root module

#### Upgrade PhoneDetail Component

Again, let's upgrade our Angular 1 controllers to Angular 2 style components via ngMetadata.

- rename `phone_detail.controller.js` to `phone-detail.component.ts` 
- rename `phone_detail.html` to `phone-detail.html` so we have consisten naming with component file 
- refactor the controller function inside to exported class `PhoneDetailComponent` and decorate it as a `@Component`

So you should have:
```typescript
import { Component } from 'ng-metadata/core';
import { CheckmarkPipe } from '../core/checkmark.pipe';

@Component( {
  selector: 'pc-phone-detail',
  template: require( './phone-detail.html' ),
  pipes: [ CheckmarkPipe ]
} )
export class PhoneDetailComponent {}
```

*NOTE* what about that `pipes` property?
- well in Angular 2 we are telling the compiler which pipes or other directives
does the view include and should compile.
- there is no such machinery in ngMetadata/Angular 1 so this is just cosmetics

- we want inject $routeParams which consist our special defined `phoneId` property.
Let's define custom interface which extends from routeParams and add there our prop

```typescript
interface PhoneRouteParams extends ng.route.IRouteParamsService {
  phoneId: string
}
```

Again we need to include back the original logic. This time we don't use `OnInit` lifecyce,
instead we call `PhoneService` directly when component is instantiated

Finished component:
```typescript
import { Component, Inject } from 'ng-metadata/core';
import { Phone, PhoneService } from '../core/phone.service';
import { CheckmarkPipe } from '../core/checkmark.pipe';

interface PhoneRouteParams extends ng.route.IRouteParamsService {
  phoneId: string
}

@Component( {
  selector: 'pc-phone-detail',
  template: require( './phone-detail.html' ),
  pipes: [ CheckmarkPipe ]
} )
export class PhoneDetailComponent {

  phone: Phone = null;
  mainImageUrl: string;

  constructor(
    @Inject( '$routeParams' ) private $routeParams: PhoneRouteParams,
    @Inject( 'Phone' ) private phoneSvc: PhoneService
  ) {
    phoneSvc.get( $routeParams.phoneId )
      .then( phone => {
        this.phone = phone;
        this.mainImageUrl = phone.images[ 0 ];
      } );
  }

  setImage( url: string ) {
    this.mainImageUrl = url;
  }

}
``` 

- register the refactored component to angular module `phone-detail.module.ts` via `provide`
```typescript
import { provide } from 'ng-metadata/core';

PhoneDetailModule
  .directive( ...provide(PhoneDetailComponent) )
```

- remove old `angular-component.js`
- hop to `app.config.ts` and update route template with new `selector` name:
```typescript
$routeProvider
  .when('/phones', {
    template: '<pc-phone-detail></pc-phone-detail>'
  }).
```

- remove empty imports from `bootstrap.ts`
```
import './js/phone_detail/phone-list.module.ts'
import './js/phone_detail/phone_detail.controller'
import './js/phone_detail/phone_detail.component'
import './js/phone_detail/phone.animation'
```

- boom! run the app to check if everything works

#### Upgrade PhoneDetail Tests

- move `test/unit/phone_detail.controller.spec.js` to `app/js/phone_detail/phone-detail.component.spec.ts`
- upgrade test to use only vanilla js/ts no angular needed yo! (Angular 2 style)
- use `$injector` for injecting angular specific services if you don't wanna mock them

```typescript
  let ctrl: PhoneDetailComponent;
  let $httpBackend: ng.IHttpBackendService;

  const xyzPhoneData = () => {
    return {
      name: 'phone xyz',
      images: [ 'image/url1.png', 'image/url2.png' ]
    }
  };

  beforeEach(function(){
    jasmine.addCustomEqualityTester(angular.equals);
  });

  beforeEach( angular.mock.inject( ( $injector: ng.auto.IInjectorService ) => {

    const $http = $injector.get<ng.IHttpService>( '$http' );
    const phoneSvc = new PhoneService( $http );
    const $routeParams = {} as PhoneRouteParams;

    $httpBackend = $injector.get<ng.IHttpBackendService>( '$httpBackend' );
    $httpBackend
      .expectGET( 'phones/xyz.json' )
      .respond( xyzPhoneData() );

    $routeParams.phoneId = 'xyz';

    ctrl = new PhoneDetailComponent( $routeParams, phoneSvc );

  } ) );
```

- run `$ npm test` and watch it pass ;)

#### Upgrade PhoneDetail Animation

- just rename `phone.animation.js` to `phone.animation.ts`
- remove angular module registration, instead just export function
- import `jQuery` so animations machinery knows what `jQuery` means 
- register to `PhoneDetailModule`
- remove `jQuery` empty import from `bootstrap.ts`

## Step 11 - create PcApp Component

Before we begin let's remove remaining magic string from DI

- rember PhoneService registration in CoreModule?
`.service( ...provide( 'Phone', { useClass: PhoneService } ) )`

- we needed this because it was used in non TS/NgMetadata files/modules
- now we are 100% TSified, let's get rid of that:
`.service( ...provide( PhoneService ) )`

- update components which are using it
- nice let's create PcApp Component

- create AppComponent class and decorate it with `@Component`
- this time we introduce inline templates
- you know the drill already:
  - export class
  - register via `provide` 

Finally let's update index.html:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Google Phone Gallery</title>
</head>
<body class="container-fluid">

  <pc-app></pc-app>

</body>
</html>
```

For the last time hop to your browser and see that amazing component based angular 1 app via your best new friend Typescript + ngMetadata


## Step X - start migration via ngUpgrade by bootstraping hybrid ng1/ng2 app


## Contact

For more information on ngMetadata/Typescript/Angular you can ask us on our [Slack](https://ngparty.slack.com). [Join us](https://ngparty.herokuapp.com) 

