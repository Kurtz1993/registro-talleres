angular.module('AppControllers', [])

.controller('MainCtrl', ['$scope', ($scope) => {
	$scope.title = 'Lista de talleres';
}])

.controller('HomeCtrl', ['$scope', '$mdDialog', 'Talleres', 'Registro', ($scope, $mdDialog, Talleres, Registro) => {
	$scope.workshops = null;
	$scope.selectedWorkshop = null;
	
	Talleres.get().then((res) => { $scope.workshops = res; });
	
	// Controller methods
	$scope.showStudentsList = (workshopIndex, event) => {
		var id = $scope.workshops[workshopIndex]._id;
		$mdDialog.show({
			controller: StudentsListCtrl,
			templateUrl: 'views/dialogTemplate.html',
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
		alert(workshopIndex);
		$scope.selectedWorkshop = workshopIndex;
	};
	
}])
;