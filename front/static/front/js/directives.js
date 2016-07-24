(function(){
    var app = angular.module('autos-directives', []);

    app.directive('navBar', function(){
    	return {
    	    restrict: 'AE',
    	    templateUrl: suJs('templates/nav-bar.html'),
    	};
    });

    app.directive('manageAutoMaker', function(){
	return {
	    restrict: 'E',
	    templateUrl: suJs('templates/contents/auto-makers.new.html'),
	};
    });

    app.directive('manageModel', function(){
	return {
	    restrict: 'E',
	    templateUrl: suJs('templates/contents/models.new.html'),
	};
    });

    app.directive('manageVehicle', function(){
	return {
	    restrict: 'E',
	    templateUrl: suJs('templates/contents/vehicles.new.html'),
	};
    });

    app.directive('vehicleFilter', function(){
	return {
	    restrict: 'E',
	    scope: {
		filters: '=',
		update: '&onUpdate'
	    },
	    templateUrl: suJs('templates/contents/vehicle.filters.html'),
	    controller: [
		'$scope', 'AutoMaker', 'VehicleModel', 'VehicleColor', 'VehicleModelType',
		function($scope, AutoMaker, VehicleModel, VehicleColor, VehicleModelType) {
		    $scope.model_types = VehicleModelType.all();
		    $scope.color_list = VehicleColor.all();

		    $scope.auto_maker_list = [];
		    AutoMaker.all().success(function(data){
			$scope.auto_maker_list = data;
		    });

		    $scope.model_list = [];
		    function loadModels() {
			VehicleModel.all($scope.filters).success(function(data){
		    	    $scope.model_list = data;
			});
		    }

		    $scope.$watch('filters.auto_maker', function HandleChanges(newValue, oldValue){
			loadModels();
		    });

		    $scope.$watch('filters.type', function HandleChanges(newValue, oldValue){
			loadModels();
		    });
		}]
	};
    });

    app.directive('modalDeleteItem', function(){
	return {
	    restrict: 'AE',
	    templateUrl: suJs('templates/contents/modal-delete-item.html'),
	    scope: {
		modalId: "@",
		entity: "@",
		name: "@",
		item: "=",
		confirm: "&onConfirm"
	    }
	};
    });
})();
