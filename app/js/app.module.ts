import * as angular from 'angular';
import * as ngRoute from 'angular-route';
import { CoreModule } from './core/core.module';
import { configure } from './app.config';
import { PhoneListModule } from './phone_list/phone-list.module.ts';

/* App Module */

export const PhonecatApp = angular
  .module( 'phonecatApp', [
    ngRoute,
    CoreModule,
    PhoneListModule,
    'phonecat.phoneDetail'
  ] )
  .config(configure);

