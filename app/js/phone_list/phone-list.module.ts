import { CoreModule } from '../core/core.module';
import { provide } from 'ng-metadata/core';
import { PhoneListComponent } from './phone-list.component';

export const PhoneListModule = angular
  .module( 'phonecat.phoneList', [ CoreModule ] )
  .directive( ...provide( PhoneListComponent ) )
  .name;
