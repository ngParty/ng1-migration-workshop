import { PhoneListComponent } from './phone-list.component';
import { PhoneService } from '../core/phone.service';

describe('PhoneListComponent', function() {

  let ctrl: PhoneListComponent;
  let $httpBackend: ng.IHttpBackendService;

  beforeEach(function(){
    jasmine.addCustomEqualityTester(angular.equals);
  });

  beforeEach( angular.mock.inject( ( $injector: ng.auto.IInjectorService ) => {

    const $http = $injector.get<ng.IHttpService>( '$http' );
    const phoneSvc = new PhoneService( $http );

    $httpBackend = $injector.get<ng.IHttpBackendService>( '$httpBackend' );
    $httpBackend
      .expectGET('phones/phones.json')
      .respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

    ctrl = new PhoneListComponent( phoneSvc );

    ctrl.ngOnInit();

  } ) );

  it( 'should create "phones" model with 2 phones fetched from xhr', () => {
    expect( ctrl.phones ).toEqual( [] );
    $httpBackend.flush();

    expect( ctrl.phones ).toEqual(
      [ { name: 'Nexus S' }, { name: 'Motorola DROID' } ] );
  } );

  it( 'should set the default value of orderProp model', () => {
    expect( ctrl.orderProp ).toBe( 'age' );
  } );

});
