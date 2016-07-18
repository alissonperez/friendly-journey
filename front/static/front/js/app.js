(function(){
    var app = angular.module('autosApp', ['ui.router']);

    app.directive('navBar', function(){
	return {
	    restrict: 'AE',
	    templateUrl: suJs('templates/nav-bar.html'),
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
		templateUrl: suJs('templates/contents/auto-makers.html')
	    })
	    .state('models', {
		url: '/modelos',
		templateUrl: suJs('templates/contents/models.html')
	    });
    });
})();
