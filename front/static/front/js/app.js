(function(){
    var app = angular.module('autosApp', ['ui.router']);

    app.directive('navBar', function(){
	return {
	    restrict: 'AE',
	    templateUrl: suJs('templates/nav-bar.html'),
	    controllerAs: 'nav',
	    controller: function(){
		this.active = 1;

		this.setActive = function(value){
		    this.active = value;
		};

		this.isActive = function(value){
		    return this.active == value;
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
	    .state('models', {
		url: '/modelos',
		templateUrl: suJs('templates/contents/models.html')
	    });
    });
})();
