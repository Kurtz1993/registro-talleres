angular.module('AppControllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {
	$scope.title = 'Lista de talleres';
}])

.controller('HomeCtrl', ['$scope', 'Talleres', ($scope, Talleres) => {
	$scope.workshops = null;
	Talleres.get().then((res) => { $scope.workshops = res; });
}])
;