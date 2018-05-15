app.factory('jobFactory', ['$http', function($http) {
	
	var jobFactory = {};
	
	jobFactory.hello = function() {
		console.log("hello");
	};
	
	return jobFactory;
}]);