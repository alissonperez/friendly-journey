(function(){
    var app = angular.module('autosApp', []);

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

    app.directive('navContent', function(){
	return {
	    restrict: 'AE',
	    templateUrl: suJs('templates/nav-content.html'),
	    controllerAs: 'cont',
	    controller: function(){
		this.test_content = 'Content'
	    }
	};
    });
})();
