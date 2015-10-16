angular.module('RegistroApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'AppControllers', 'AppServices'])
  .config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal');
    $routeProvider
      .when('/home', {
        templateUrl: 'views/home.html'
      })
      .when('/talleres/:semester', {
        controller: 'WorkshopsCtrl',
        templateUrl: 'views/workshops.html'
      })
      .when('/listas', {
        controller: 'ListasCtrl',
        templateUrl: 'views/listas.html'
      })
      .when('/listas/:idTaller', {
        controller: 'GenerarListaCtrl',
        templateUrl: 'views/listaGenerada.html'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }]);
