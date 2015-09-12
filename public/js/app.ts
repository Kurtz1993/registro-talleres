angular.module('RegistroApp', ['ngRoute', 'ngMaterial', 'AppControllers', 'AppServices'])
.config(['$routeProvider', '$mdThemingProvider', ($routeProvider, $mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.primaryPalette('teal');
		
	$routeProvider
		.when('/home', {
			controller: 'HomeCtrl',
			templateUrl: 'views/home.html'
		})
		.otherwise({
			redirectTo: '/home'
		});
}]);