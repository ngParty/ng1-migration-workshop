import { CheckmarkPipe } from './checkmark.pipe';

describe('CheckmarkPipe', function() {

  let pipe: CheckmarkPipe;

  beforeEach( ()=> {

    pipe = new CheckmarkPipe();

  } );

  it( 'should convert boolean values to unicode checkmark or cross', () => {

    expect( pipe.transform( true ) ).toBe( '\u2713' );
    expect( pipe.transform( false ) ).toBe( '\u2718' );

  } );

});
