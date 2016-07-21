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
	    controller: function($scope, AutoMaker){
		if (! $scope.auto_maker) {
		    $scope.auto_maker = {};
		}

		$scope.save = function() {
		    AutoMaker.save($scope.auto_maker);
		};
	    }
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
	this.$get = function() {
	    return {
		all: function() {
		    return [
			{id: 1, name: 'Toyota'},
			{id: 2, name: 'Fiat'},
		    ]
		},
		save: function(automaker) {
		    if (automaker.id) {
			console.log('Updating ' + automaker.name);
		    }
		    else {
			console.log('Creating ' + automaker.name);
		    }
		},
		delete: function(automaker) {
		    console.log('Deleting ' + automaker.name);
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
		    $scope.list = AutoMaker.all();

		    $scope.showNew = function(){
			$scope.auto_maker = null;
			$("#newAutoMakerModal").modal();
		    };

		    $scope.deleteConfirm = function(automaker) {
			$scope.auto_maker = automaker;
			$("#modalDeleteAutoMaker").modal();
		    }

		    $scope.delete = function(automaker) {
			$("#modalDeleteAutoMaker").modal('hide');
			AutoMaker.delete(automaker);
		    };

		    $scope.edit = function(automaker) {
			$scope.auto_maker = automaker;
			$("#newAutoMakerModal").modal();
		    };
		}]
	    })
	    .state('models', {
		url: '/modelos',
		templateUrl: suJs('templates/contents/models.html')
	    });
    });
})();
