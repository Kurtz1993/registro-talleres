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
		getStudentsByWorkshopId: (params) =>{
			var deferred = $q.defer();
			$http.get('/api/workshops/' + params.id + '/students')
				.success((response) => { deferred.resolve(response); })
				.error((error) => { deferred.reject(error); });
			return deferred.promise;
		}
	};
}])
.factory('Registro', ['$http', '$q', ($http, $q) => {
	var requestOptions = {
    timeout: 20000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    transformRequest: serializeJSON
  };

	// Convierte un JSON a form data...
	function serializeJSON(obj) {
		var str = [];
		for (var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		return str.join("&");
	}
	return {
		post: (student) =>{
			var deferred = $q.defer();
			$http.post('/api/register', student, requestOptions)
				.success((response) => { deferred.resolve(response); })
				.error((error) => { deferred.reject(error); });
			return deferred.promise;
		}
	};
}]);