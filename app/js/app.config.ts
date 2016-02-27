configure.$inject = ['$routeProvider'];
export function configure( $routeProvider: ng.route.IRouteProvider ) {
  $routeProvider.when( '/phones', {
    template: '<pc-phone-list></pc-phone-list>'
  } ).when( '/phones/:phoneId', {
    template: '<pc-phone-detail></pc-phone-detail>'
  } ).otherwise( {
    redirectTo: '/phones'
  } );
}
