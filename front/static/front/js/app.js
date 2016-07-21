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
	    restrict: 'AE',
	    templateUrl: suJs('templates/contents/auto-makers.new.html'),
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
    })

    // AutoMaker provider
    app.provider('AutoMaker', function AutoMakerProvider(){
	this.$get = function($http) {
	    return {
		all: function() {
		    return $http.get('/api/v1/automakers/');
		},
		save: function(automaker) {
		    if (automaker.id) {
			return $http.patch('/api/v1/automakers/' + automaker.id + '/', automaker);
		    }
		    else {
			return $http.post('/api/v1/automakers/', automaker);
		    }
		},
		delete: function(automaker) {
		    return $http.delete('/api/v1/automakers/' + automaker.id + '/', automaker);
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
		templateUrl: suJs('templates/contents/models.html')
	    });
    });
})();
