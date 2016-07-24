(function(){
    var app = angular.module('autosApp', ['ui.router']);

    function convertEngine(value) {
	if (value >= 1000) {
	    return (value / 1000).toFixed(1);
	}

	return value;
    }

    function sanitizeEngine(value) {
	if (value >= 0 && value <= 10) {
	    return Math.trunc(value * 1000);
	}

	return value;
    }

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
	    };
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

    // VehicleModel provider
    app.provider('VehicleModel', function VehicleModelProvider(){
	var baseUrl = '/api/v1/models/';

	this.$get = function($http) {
	    return {
		all: function(params) {
		    if (params) {
			for (var key in params) {
			    if (params[key] === "" || params[key] === null || params[key] === undefined) {
				delete params[key];
			    }
			}
		    }

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
	    };
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
	    };
	};
    });

    app.filter('displayType', function(VehicleModelType) {
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
	return function(input) {
	    return convertEngine(input);
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
		}]
	    });
    });
})();
