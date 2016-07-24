(function(){
    var app = angular.module('autos-filters', []);

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
})();
