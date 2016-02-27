import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/app.css';
import './css/animations.css';

import 'jquery';
import { bootstrap } from 'ng-metadata/platform';
import { PhonecatApp } from './js/app.module';

import 'angular-animate';

import './js/phone_detail/phone_detail.module'
import './js/phone_detail/phone_detail.controller'
import './js/phone_detail/phone_detail.component'
import './js/phone_detail/phone.animation'

bootstrap( PhonecatApp );

