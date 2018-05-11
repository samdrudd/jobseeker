var app = angular.module("jobseeker", []);

app.factory('jobFactory', ['$http', function($http) {
	
	var jobFactory = {};
	var urlBase = "http://127.0.0.1:8000/";
	
	jobFactory.getAllJobs = function() {
		return $http({
				url: urlBase + "jobs",
				method: "GET"});
	};
	
	jobFactory.addJob = function(job) {
		return $http({
				url: urlBase + "jobs",
				method: "POST",
				data: $.param(job),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	jobFactory.editJob = function(id, job) {
		return $http({
				url: urlBase + "jobs/" + id,
				method: "PUT",
				data: $.param(job),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	jobFactory.deleteJob = function(id) {
		return $http({
				url: urlBase + "jobs/" + id,
				method: "DELETE" });
	};
	
	return jobFactory;
}]);