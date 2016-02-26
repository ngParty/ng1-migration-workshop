import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/app.css';
import './css/animations.css';

import 'jquery';
import { bootstrap } from 'ng-metadata/platform';
import { PhonecatApp } from './js/app.module';

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

bootstrap( PhonecatApp );

