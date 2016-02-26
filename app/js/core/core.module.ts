import * as angular from 'angular';
import { provide } from 'ng-metadata/core';
import { CheckmarkPipe } from './checkmark.pipe';
import { PhoneService } from './phone.service';

export const CoreModule = angular
  .module( 'phonecat.core', [] )
  .filter( ...provide( CheckmarkPipe ) )
  .service( ...provide( 'Phone', { useClass: PhoneService } ) )
  .name;
