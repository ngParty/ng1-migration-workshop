import * as angular from 'angular';
import * as ngRoute from 'angular-route';
import { CoreModule } from './core/core.module';
import { provide } from 'ng-metadata/core';
import { PhoneListModule } from './phone_list/phone-list.module.ts';
import { PhoneDetailModule } from './phone_detail/phone-detail.module';
import { AppComponent } from './app.component';
import { configure } from './app.config';

/* App Module */

export const PhonecatApp = angular
  .module( 'phonecatApp', [
    ngRoute,
    CoreModule,
    PhoneListModule,
    PhoneDetailModule
  ] )
  .config( configure )
  .directive( ...provide( AppComponent ) );

