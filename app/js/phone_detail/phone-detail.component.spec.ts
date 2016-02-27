import { PhoneService } from '../core/phone.service';
import { PhoneDetailComponent, PhoneRouteParams } from './phone-detail.component';

describe('PhoneDetailComponent', function() {

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

  it('should fetch phone detail', ()=> {

    expect( ctrl.phone ).toEqual( null );
    $httpBackend.flush();

    expect( ctrl.phone ).toEqual( xyzPhoneData() );
  });

});

