(function(){
    var app = angular.module('autos-controllers', []);

    app.controller(
	'VehicleController',
	['$scope', 'Vehicle', 'AutoMaker', 'VehicleModel', 'VehicleColor',
	 function($scope, Vehicle, AutoMaker, VehicleModel, VehicleColor) {
	     $scope.list = [];

	     $scope.color_list = VehicleColor.all();

	     $scope.filters = {};

	     $scope.$watch('vehicle.auto_maker', function HandleChanges(newValue, oldValue){
		 VehicleModel.all({'auto_maker': newValue}).success(function(data){
		     $scope.model_list = data;
		 });
	     });

	     $scope.filterChanged = function(filters) {
		 $scope.filters = filters;
		 loadItems();
	     };

	     $scope.auto_maker_list = [];
	     AutoMaker.all().success(function(data){
		 $scope.auto_maker_list = data;
	     });

	     $scope.model_list = [];
	     VehicleModel.all().success(function(data){
		 $scope.model_list = data;
	     });

	     function loadItems() {
		 var filters = angular.copy($scope.filters);

		 for (var key in filters) {
		     if (filters[key] === "" || filters[key] === null || filters[key] === undefined) {
			 delete filters[key];
		     }
		 }

		 if (filters.hasOwnProperty('engine_start')) {
		     filters.engine_start = sanitizeEngine(filters.engine_start);
		 }

		 if (filters.hasOwnProperty('engine_end')) {
		     filters.engine_end = sanitizeEngine(filters.engine_end);
		 }

		 console.log(filters);

		 Vehicle.all(filters).success(function(data){
		     $scope.list = data;
		 });
	     }

	     loadItems();

	     $scope.showNew = function(){
		 $scope.vehicle = {};
		 $("#newVehicleModal").modal();
	     };

	     $scope.edit = function(vehicle){
		 vehicle = angular.copy(vehicle);

		 vehicle.auto_maker = vehicle.model_info.auto_maker;
		 vehicle.engine = Number.parseFloat(convertEngine(vehicle.engine));

		 $scope.vehicle = vehicle;
		 $('#newVehicleModal').modal();
	     };

	     $scope.save = function(vehicle) {
		 vehicle.engine = sanitizeEngine(vehicle.engine);
		 Vehicle.save(vehicle).success(function(data){
		     $("#newVehicleModal").modal('hide');
		     loadItems();
		 });
	     };

	     $scope.deleteConfirm = function(vehicle) {
		 $scope.vehicle = vehicle;
		 $("#modalDeleteVehicle").modal();
	     };

	     $scope.delete = function(vehicle) {
		 $("#modalDeleteVehicle").modal('hide');
		 Vehicle.delete(vehicle).success(function(data){
		     loadItems();
		 });
	     };
	 }])

    app.controller(
	'AutoMakerController',
	['$scope', 'AutoMaker', function($scope, AutoMaker){
	    $scope.list = [];

	    function load_items(){
		AutoMaker.all().success(function(data){
		    $scope.list = data;
		});
	    }

	    load_items();

	    $scope.showNew = function(){
		$scope.auto_maker = {};
		$("#newAutoMakerModal").modal();
	    };

	    $scope.deleteConfirm = function(automaker) {
		$scope.auto_maker = automaker;
		$("#modalDeleteAutoMaker").modal();
	    };

	    $scope.delete = function(automaker) {
		$("#modalDeleteAutoMaker").modal('hide');
		AutoMaker.delete(automaker).success(function(data){
		    load_items();
		});
	    };

	    $scope.edit = function(automaker) {
		$scope.auto_maker = automaker;
		$("#newAutoMakerModal").modal();
	    };

	    $scope.save = function(automaker) {
		AutoMaker.save(automaker).success(function(data){
		    $("#newAutoMakerModal").modal('hide');
		    load_items();
		});
	    };
	}])

    app.controller(
	'ModelController',
	['$scope', 'VehicleModel', 'VehicleModelType', 'AutoMaker',
	 function($scope, VehicleModel, VehicleModelType, AutoMaker){
	     $scope.list = [];
	     $scope.auto_makers = [];
	     $scope.model_types = VehicleModelType.all();

	     AutoMaker.all().success(function(data){
		 $scope.auto_makers = data;
	     });

	     function load_items() {
		 VehicleModel.all().success(function(data){
		     $scope.list = data;
		 });
	     }

	     load_items();

	     $scope.deleteConfirm = function(model) {
		 $scope.vehicle_model = model;
		 $("#modalDeleteVehicleModel").modal();
	     };

	     $scope.delete = function(model) {
		 $("#modalDeleteVehicleModel").modal('hide');
		 VehicleModel.delete(model).success(function(data){
		     load_items();
		 });
	     };

	     $scope.showNew = function() {
		 $scope.vehicle_model = {};
		 $('#newVehicleModelModal').modal();
	     };

	     $scope.edit = function(model){
		 $scope.vehicle_model = model;
		 $('#newVehicleModelModal').modal();
	     };

	     $scope.save = function(model) {
		 VehicleModel.save(model).success(function(data){
		     $('#newVehicleModelModal').modal('hide');
		     load_items();
		 });
	     };
	 }])
})();
