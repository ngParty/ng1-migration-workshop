import { PhoneService } from './phone.service';


describe( 'PhoneService', () => {

  const $httpMock = {
    get( url: string ){
      return {
        then(){}
      }
    }
  };

  let phone: PhoneService;

  beforeEach( ()=> {

    spyOn( $httpMock, 'get' ).and.callThrough();
    phone = new PhoneService( $httpMock as any );

  } );

  it( `should check the existence of PhoneService`, ()=> {

    expect( phone ).toBeDefined();

  } );

  it( `should call $http.get on query`, ()=> {

    phone.query();
    expect( $httpMock.get ).toHaveBeenCalledWith('phones/phones.json');

  } );

  it( `should call $http.get on get`, ()=> {

    phone.get('1');
    expect( $httpMock.get ).toHaveBeenCalledWith('phones/1.json');

  } );

} );
