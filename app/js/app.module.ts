import * as angular from 'angular';
import * as ngRoute from 'angular-route';
import { configure } from './app.config';

/* App Module */

export const PhonecatApp = angular
  .module( 'phonecatApp', [
    ngRoute,
    'phonecat.core',
    'phonecat.phoneList',
    'phonecat.phoneDetail'
  ] )
  .config(configure);

