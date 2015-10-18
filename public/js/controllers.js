angular.module('AppControllers', [])
  .controller('MainCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.title = 'XXIX Semana del Médico D. en C. Luz Margarita Baltazar Rodríguez';
    $scope.toggleMenu = function() {
      $mdSidenav('left').open().then(function(){ console.log("Opened"); })
    };
  }])
  .controller('WorkshopsCtrl', ['$scope', '$routeParams', '$mdDialog', 'Talleres', 'Registro', 
    function ($scope, $routeParams, $mdDialog, Talleres, Registro) {
    $scope.workshops = null;
    $scope.selectedWorkshop = null;
    $scope.semester = $routeParams.semester;
    Talleres.getBySemester($scope.semester).then(function (res) {
      $scope.workshops = res;
      $scope.workshops.forEach(function (workshop, index) {
        Talleres.getStudentsByWorkshopId({ id: workshop._id }).then(function (res) {
          workshop.available = true;
          workshop.current = res.length;
          if (workshop.current >= workshop.total) {
            workshop.available = false;
          }
        });
      });
    });
    
    // Utility
    
    function getWorkshopId(workshopIndex){
      for (var i = 0; i<$scope.workshops.length; i++){
        if($scope.workshops[i]._id === workshopIndex){
          return $scope.workshops[i]._id;
        }
      }
    }
    
    function getWorkshopMaterial(workshopIndex){
      for (var i = 0; i<$scope.workshops.length; i++){
        if($scope.workshops[i]._id === workshopIndex){
          return $scope.workshops[i].material;
        }
      }
    }
    
    $scope.showStudentsList = function (workshopIndex, event) {
      var id = getWorkshopId(workshopIndex);
      
      $mdDialog.show({
        controller: StudentsListCtrl,
        templateUrl: 'views/studentsListTemplate.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { workshopId: id },
        bindToController: true,
        clickOutsideToClose: true
      });
      function StudentsListCtrl($scope, workshopId) {
        $scope.studentsList = null;
        Talleres.getStudentsByWorkshopId({ id: workshopId }).then(function (res) {
          $scope.studentsList = res;
        });
        $scope.dismissDialog = function () {
          $mdDialog.cancel();
        };
      }
    };
    $scope.showRegistration = function (workshopIndex, event) {
      var id = getWorkshopId(workshopIndex);
      $mdDialog.show({
        controller: RegistrationCtrl,
        templateUrl: 'views/registrationFormTemplate.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { workshopId: id, semester: $scope.semester },
        bindToController: true,
        clickOutsideToClose: true
      }).then(function () {
        Talleres.getBySemester().then(function (res) {
          $scope.workshops = res;
          $scope.workshops.forEach(function (workshop, index) {
            Talleres.getStudentsByWorkshopId({ id: workshop._id }).then(function (res) {
              workshop.available = true;
              workshop.current = res.length;
              if (workshop.current === workshop.total) {
                workshop.available = false;
              }
            });
          });
        });
      });
      function RegistrationCtrl($scope, $route, $mdDialog, $mdToast, Registro, workshopId, semester) {
        $scope.student = {
          accountNumber: "",
          name: "",
          idTaller: workshopId,
          semester: semester
        };
        $scope.dismissDialog = function () {
          $mdDialog.cancel();
        };
        $scope.registerStudent = function () {
          if (/^\d{1,8}$/.test($scope.student.accountNumber) && $scope.student.accountNumber.length === 8
            && /^[A-Za-záéíóúñ\s]+$/.test($scope.student.name) && $scope.student.name.length > 0) {
            var yes = confirm("¿Estás seguro de querer registrarte en este taller?");
            if (yes) {
              Registro.post($scope.student).then(function (res) {
                if (res.success) {
                  alert(res.data);
                  $mdToast.show($mdToast.simple()
                    .content(res.data)
                    .position('bottom right')
                    .hideDelay(5000));
                  $mdDialog.hide();
                }
                else {
                  alert("Error: " + res.data);
                  $mdToast.show($mdToast.simple()
                    .content("Error: " + res.data)
                    .position('bottom right')
                    .hideDelay(5000));
                  $mdDialog.hide();
                }
              });
              $route.reload();
            }
            else {
              $mdDialog.hide();
            }
          }
          else {
            $mdToast.show($mdToast.simple()
              .content("Error: Revisa que tus datos sean correctos")
              .position('bottom right')
              .hideDelay(5000));
          }
        };
      }
    };
    $scope.showMaterial = function (workshopIndex, event) {
      var material = getWorkshopMaterial(workshopIndex) || [];
      $mdDialog.show({
        controller: ShowMaterialCtrl,
        templateUrl: 'views/materialTemplate.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { material: material },
        bindToController: true,
        clickOutsideToClose: true
      });
      function ShowMaterialCtrl($scope, material) {
        $scope.material = material;
        $scope.dismissDialog = function () {
          $mdDialog.cancel();
        };
      }
    };
  }])
  .controller('ListasCtrl', ['$scope', 'Talleres', function ($scope, Talleres) {
    $scope.workshops = null;
    $scope.days = [
      {
        name:"Lunes y Martes",
        id: 1
      },{
        name:"Miércoles y Jueves",
        id: 2  
      }
    ];
    $scope.semesters = [1,3,5];
    var elements = document.getElementsByClassName('disappear');
    for(var i = 0; i<elements.length; i++){
      elements[i].style.display = "none";
    }
    Talleres.getAll().then(function (res) {
      if(res.success){
        $scope.workshops = res.data;
        $scope.workshops.forEach(function (workshop, index) {
          Talleres.getStudentsByWorkshopId({ id: workshop._id }).then(function (res) {
            workshop.available = true;
            workshop.current = res.length;
            if (workshop.current >= workshop.total) {
              workshop.available = false;
            }
          });
        });
      } else {
        alert(res.data);
      }
    });
  }])
  .controller('GenerarListaCtrl', ['$scope', '$routeParams', '$window', 'Talleres', function($scope, $routeParams, $window, Talleres){
    var workshopId = parseInt($routeParams.idTaller);
    var elements = document.getElementsByClassName('disappear');
    for(var i = 0; i<elements.length; i++){
      elements[i].style.display = "none";
    }
    $scope.students = null;
    $scope.workshop = null;
    $scope.dias = null;
    $scope.encargado = prompt("Nombre del encargado del taller: ");
    Talleres.get(workshopId).then(function(res){
      if(res.success){
        $scope.workshop = res.data;
        $scope.dias = res.data.day.split(" y ");
      } else {
        alert(res.data);
      }
    });
    
    Talleres.getStudentsByWorkshopId({id: workshopId}).then(function(res){
      $scope.students = res;
    });
    
    $scope.print = function() {
      $window.print();
    };
  }]);
