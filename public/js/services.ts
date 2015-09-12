angular.module('AppServices', [])
.factory('Talleres', ['$http', '$q', ($http, $q) => {
	return {
		get: () =>{
			var deferred = $q.defer();
			$http.get('/api/workshops')
				.success((response) => { deferred.resolve(response); })
				.error((error) => { deferred.reject(error); });
			return deferred.promise;
		},
		getByWorkshopId: (params) =>{
			var deferred = $q.defer();
			$http.get('/api/workshops/' + params.id + '/students')
				.success((response) => { deferred.resolve(response); })
				.error((error) => { deferred.reject(error); });
			return deferred.promise;
		}
	}
}])
.factory('Registro', ['$http', '$q', ($http, $q) => {
	return null;
}]);