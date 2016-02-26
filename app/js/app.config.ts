configure.$inject = ['$routeProvider'];
export function configure( $routeProvider: ng.route.IRouteProvider ) {
  $routeProvider.when( '/phones', {
    template: '<phone-list></phone-list>'
  } ).when( '/phones/:phoneId', {
    template: '<phone-detail></phone-detail>'
  } ).otherwise( {
    redirectTo: '/phones'
  } );
}
