import * as ngAnimate from 'angular-animate';
import { provide } from 'ng-metadata/core';
import { CoreModule } from '../core/core.module';
import { PhoneDetailComponent } from './phone-detail.component';
import { phoneAnimation } from './phone.animation';

export const PhoneDetailModule = angular
  .module( 'phonecat.phoneDetail', [
    ngAnimate,
    CoreModule
  ] )
  .directive( ...provide( PhoneDetailComponent ) )
  .animation( '.phone', phoneAnimation )
  .name;
