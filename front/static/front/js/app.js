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

    app.directive('manageVehicle', function(){
	return {
	    restrict: 'E',
	    templateUrl: suJs('templates/contents/vehicles.new.html'),
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
    app.provider('VehicleModel', function VehicleModelProvider(){
	var baseUrl = '/api/v1/models/';

	this.$get = function($http) {
	    return {
		all: function(params) {
		    return $http.get(baseUrl, {'params': params});
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

    app.provider('VehicleColor', function VehicleColorProvider(){
	this.$get = function() {
	    return {
		all: function() {
		    return [
			{'id': 'red', 'name': 'Vermelho'},
			{'id': 'blue', 'name': 'Azul'},
			{'id': 'green', 'name': 'Verde'},
			{'id': 'white', 'name': 'Branco'},
			{'id': 'grey', 'name': 'Cinza'},
			{'id': 'black', 'name': 'Preto'},
		    ];
		}
	    };
	};
    });

    app.filter('displayColor', function(VehicleColor) {
	var colors = VehicleColor.all();

	return function(input) {
	    for (var i=0; i < colors.length; i++) {
		if (colors[i].id == input) {
		    return colors[i].name;
		}
	    }

	    return input;
	};
    });

    app.filter('displayEngine', function() {
	return function(input, type) {
	    if (type == 'car') {
		return (input / 1000).toFixed(1);
	    }

	    return input;
	};
    });

    // Vehicle provider
    app.provider('Vehicle', function VehicleProvider(){
	var baseUrl = '/api/v1/vehicles/';

	this.$get = function($http) {
	    return {
		all: function(filters) {
		    return $http.get(baseUrl, {'params': filters});
		},
		save: function(vehicle) {
		    if (vehicle.id) {
			return $http.patch(baseUrl + vehicle.id + '/', vehicle);
		    }
		    else {
			return $http.post(baseUrl, vehicle);
		    }
		},
		delete: function(vehicle) {
		    return $http.delete(baseUrl + vehicle.id + '/');
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
		templateUrl: suJs('templates/contents/vehicles.html'),
		controller: ['$scope', 'Vehicle', 'AutoMaker', 'VehicleModel', 'VehicleColor', function($scope, Vehicle, AutoMaker, VehicleModel, VehicleColor) {
		    $scope.list = [];
		    $scope.model_list_to_add = [];

		    $scope.color_list = VehicleColor.all();

		    $scope.filters = angular.fromJson(sessionStorage.vehiclesFilters) || {};

		    $scope.$watch('filters.auto_maker', function HandleChanges(newValue, oldValue){
			loadModels($scope.filters, function(data){
			    $scope.model_list = data;
			});
		    });

		    $scope.$watch('filters.type', function HandleChanges(newValue, oldValue){
			loadModels($scope.filters, function(data){
			    $scope.model_list = data;
			});
		    });

		    $scope.$watch('vehicle.auto_maker', function HandleChanges(newValue, oldValue){
			loadModels({'auto_maker': newValue}, function(data){
			    $scope.model_list_to_add = data;
			});
		    });

		    $scope.filterChanged = function() {
			for (var key in $scope.filters) {
			    if ($scope.filters[key] == "") {
				delete $scope.filters[key];
			    }
			}

			sessionStorage.vehiclesFilters = angular.toJson($scope.filters);

			load_items();
		    };

		    $scope.auto_maker_list = [];
		    AutoMaker.all().success(function(data){
			$scope.auto_maker_list = data;
		    });

		    $scope.model_list = []
		    function loadModels(new_params, callback) {
			var params = {}

			if (new_params.hasOwnProperty('type') && new_params['type'] !== "") {
			    params['type'] = new_params['type'];
			}

			if (new_params.hasOwnProperty('auto_maker') && new_params['auto_maker'] !== "") {
			    params['auto_maker'] = new_params['auto_maker'];
			}

			VehicleModel.all(params).success(callback);
		    }

		    loadModels($scope.filters, function(data){
			$scope.model_list = data;
		    });

		    loadModels({}, function(data){
			$scope.model_list_to_add = data;
		    });

		    function load_items() {
			Vehicle.all($scope.filters).success(function(data){
			    $scope.list = data;
			});
		    }

		    load_items();

		    $scope.showNew = function(){
			$scope.vehicle = {};
			$("#newVehicleModal").modal();
		    };

		    $scope.edit = function(vehicle){
			vehicle.auto_maker = vehicle.model_info.auto_maker;
			$scope.vehicle = vehicle;
			$('#newVehicleModal').modal();
		    };

		    $scope.save = function(vehicle) {
			Vehicle.save(vehicle).success(function(data){
			    $("#newVehicleModal").modal('hide');
			    load_items();
			});
		    };

		    $scope.deleteConfirm = function(vehicle) {
			$scope.vehicle = vehicle;
			$("#modalDeleteVehicle").modal();
		    }

		    $scope.delete = function(vehicle) {
			$("#modalDeleteVehicle").modal('hide');
			Vehicle.delete(vehicle).success(function(data){
			    load_items();
			});
		    };
		}]
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
