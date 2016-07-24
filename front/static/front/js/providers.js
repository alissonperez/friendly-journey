(function(){
    var app = angular.module('autos-providers', []);

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
})();
