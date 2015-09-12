angular.module('AppControllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {
	$scope.title = 'Lista de talleres';
}])

.controller('HomeCtrl', ['$scope', '$mdDialog', 'Talleres', 'Registro', ($scope, $mdDialog, Talleres, Registro) => {
	$scope.workshops = null;
	$scope.selectedWorkshop = null;
	
	Talleres.get().then((res) => {
		$scope.workshops = res;
		$scope.workshops.forEach((workshop, index) => {
			Talleres.getStudentsByWorkshopId({id: workshop._id}).then((res) => {
				workshop.available = true;
				workshop.current = res.length;
				if(workshop.current === workshop.total){
					workshop.available = false;
				}
			});
		});
	});
	
	// Controller methods
	$scope.showStudentsList = (workshopIndex, event) => {
		var id:number = $scope.workshops[workshopIndex]._id;
		$mdDialog.show({
			controller: StudentsListCtrl,
			templateUrl: 'views/studentsListTemplate.html',
			parent: angular.element(document.body),
			targetEvent: event,
			locals: {workshopId: id},
			bindToController: true,
			clickOutsideToClose: true
		});
		
		function StudentsListCtrl ($scope, workshopId){
			$scope.studentsList = null;
			Talleres.getByWorkshopId({id: workshopId}).then((res) => {
				$scope.studentsList = res;
			});
			$scope.dismissDialog = () => {
				$mdDialog.hide();
			};
		}
	};
	
	$scope.showRegistration = (workshopIndex, event) => {
		var id:number = $scope.workshops[workshopIndex]._id;
		$mdDialog.show({
			controller: StudentsListCtrl,
			templateUrl: 'views/registrationFormTemplate.html',
			parent: angular.element(document.body),
			targetEvent: event,
			locals: {workshopId: id},
			bindToController: true,
			clickOutsideToClose: true
		});
		
		function StudentsListCtrl ($scope, workshopId){
			$scope.dismissDialog = () => {
				$mdDialog.hide();
			};
		}
	};
	
}])
;