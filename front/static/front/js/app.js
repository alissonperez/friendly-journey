(function(){
    var app = angular.module('autosApp', ['ui.router']);

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

    // AutoMaker provider
    app.provider('AutoMaker', function AutoMakerProvider(){
	var baseUrl = '/api/v1/automakers/';

	this.$get = function($http) {
	    return {
		all: function() {
		    return $http.get(baseUrl);
		},
		save: function(automaker) {
		    if (automaker.id) {
			return $http.patch(baseUrl + automaker.id + '/', automaker);
		    }
		    else {
			return $http.post(baseUrl, automaker);
		    }
		},
		delete: function(automaker) {
		    return $http.delete(baseUrl + automaker.id + '/', automaker);
		}
	    }
	};
    });

    app.provider('VehicleModelType', function VehicleModelTypeProvider(){
	this.$get = function() {
	    return {
		all: function() {
		    return [
			{id: 'car', name: 'Carro'},
			{id: 'motorcycle', name: 'Moto'}
		    ];
		}
	    };
	};
    });

    app.filter('display_type', function(VehicleModelType) {
	var model_types = VehicleModelType.all();
	return function(input) {
	    for (var i=0; i < model_types.length; i++) {
		if (model_types[i].id == input) {
		    return model_types[i].name;
		}
	    }

	    return input;
	};
    });

    // VehicleModel provider
    app.provider('VehicleModel', function AutoMakerProvider(){
	var baseUrl = '/api/v1/models/';

	this.$get = function($http) {
	    return {
		all: function() {
		    return $http.get(baseUrl);
		},
		save: function(automaker) {
		    if (automaker.id) {
			return $http.patch(baseUrl + automaker.id + '/', automaker);
		    }
		    else {
			return $http.post(baseUrl, automaker);
		    }
		},
		delete: function(automaker) {
		    return $http.delete(baseUrl + automaker.id + '/', automaker);
		}
	    }
	};
    });

    // Rotas
    app.config(function($stateProvider, $urlRouterProvider) {
	// Rota default
	$urlRouterProvider.otherwise('/veiculos');

	$stateProvider
	    .state('vehicles', {
		url: "/veiculos",
		templateUrl: suJs('templates/contents/vehicles.html')
	    })
	    .state('auto-makers', {
		url: "/montadoras",
		templateUrl: suJs('templates/contents/auto-makers.html'),
		controller: ['$scope', 'AutoMaker', function($scope, AutoMaker){
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
		    }

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
		}]
	    })
	    .state('models', {
		url: '/modelos',
		templateUrl: suJs('templates/contents/models.html'),
		controller: ['$scope', 'VehicleModel', 'VehicleModelType', 'AutoMaker', function($scope, VehicleModel, VehicleModelType, AutoMaker){
		    $scope.list = [];
		    $scope.auto_makers = [];
		    $scope.model_types = VehicleModelType.all();

		    AutoMaker.all().success(function(data){
			$scope.auto_makers = data;
		    });

		    function load_items() {
			VehicleModel.all().success(function(data){
			    console.log(data)
			    $scope.list = data;
			});
		    }

		    load_items()

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
		}]
	    });
    });
})();
