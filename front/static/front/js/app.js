(function(){
    var app = angular.module(
	'autos',
	['ui.router', 'autos-directives', 'autos-providers', 'autos-filters', 'autos-controllers']);

    // Rotas
    app.config(function($stateProvider, $urlRouterProvider) {
	// Rota default
	$urlRouterProvider.otherwise('/veiculos');

	$stateProvider
	    .state('vehicles', {
		url: "/veiculos",
		templateUrl: suJs('templates/contents/vehicles.html'),
		controller: 'VehicleController'
	    })
	    .state('auto-makers', {
		url: "/montadoras",
		templateUrl: suJs('templates/contents/auto-makers.html'),
		controller: 'AutoMakerController'
	    })
	    .state('models', {
		url: '/modelos',
		templateUrl: suJs('templates/contents/models.html'),
		controller: 'ModelController'
	    });
    });
})();
