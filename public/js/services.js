angular.module('AppServices', [])
  .factory('Talleres', ['$http', '$q', function ($http, $q) {
    return {
      get: function (id) {
        var deferred = $q.defer();
        $http.get('/api/workshop/' + id)
          .success(function (response) { deferred.resolve(response); })
          .error(function (error) { deferred.reject(error); });
        return deferred.promise;
      },
      getBySemester: function (semester) {
        var deferred = $q.defer();
        $http.get('/api/workshops/' + semester)
          .success(function (response) { deferred.resolve(response); })
          .error(function (error) { deferred.reject(error); });
        return deferred.promise;
      },
      getStudentsByWorkshopId: function (params) {
        var deferred = $q.defer();
        $http.get('/api/workshops/' + params.id + '/students')
          .success(function (response) { deferred.resolve(response); })
          .error(function (error) { deferred.reject(error); });
        return deferred.promise;
      },
      getAll: function (){
        var deferred = $q.defer();
        $http.get('/api/workshops')
          .success(function (response) { deferred.resolve(response); })
          .error(function (err) { deferred.reject(err); });
          return deferred.promise;
      }
    };
  }])
  .factory('Registro', ['$http', '$q', function ($http, $q) {
    var requestOptions = {
      timeout: 20000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      transformRequest: serializeJSON
    };
    function serializeJSON(obj) {
      var str = [];
      for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }
    return {
      post: function (student) {
        var deferred = $q.defer();
        $http.post('/api/register', student, requestOptions)
          .success(function (response) { deferred.resolve(response); })
          .error(function (error) { deferred.reject(error); });
        return deferred.promise;
      }
    };
  }]);
