import { Component, Inject } from 'ng-metadata/core';
import { Phone, PhoneService } from '../core/phone.service';
import { CheckmarkPipe } from '../core/checkmark.pipe';

export interface PhoneRouteParams extends ng.route.IRouteParamsService {
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
