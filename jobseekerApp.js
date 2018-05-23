var app = angular.module('jobseeker', ['ngCookies']);

app.factory('Job', ['$http', function($http) {
	
	var Job = {};
	var urlBase = "http://127.0.0.1:8000/";
	
	Job.job = function(job) {
		if (job)
			return {
				_id : job._id,
				date :  job.date,
				title : job.title,
				status : job.status,
				company : job.company,
				location : job.location,
				via : job.via
			};
		else
			return {
				date : new Date(),
				status : "applied"
			};
	};
	
	Job.getAllJobs = function() {
		return $http({
				url: urlBase + "jobs",
				method: "GET"});
	};
	
	Job.addJob = function(job) {
		return $http({
				url: urlBase + "jobs",
				method: "POST",
				data: $.param(job),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	Job.editJob = function(id, job) {
		return $http({
				url: urlBase + "jobs/" + id,
				method: "PUT",
				data: $.param(job),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	Job.deleteJob = function(id) {
		return $http({
				url: urlBase + "jobs/" + id,
				method: "DELETE" });
	};
	
	return Job;
}]);

app.factory('Sort', function() {
	
	var Sort = {};
	var _orderBy = "";
	var _reverse = false;
	
	Sort.sort = function() {
		return {
			orderBy : _orderBy,
			reverse : _reverse
		};
	};
	
	Sort.isSortedBy = function(colname) {
		return _orderBy === colname;
	};
	
	Sort.by = function(colname) {
		if (this.isSortedBy(colname))
			_reverse = !_reverse;
		else {
			_orderBy = colname;
			_reverse = false;
		}
	};
	
	Sort.getOrder = function() {
		return _orderBy;
	};
	
	Sort.getReverse = function() {
		return _reverse;
	};
	
	Sort.clear = function() {
		_reverse = false;
		_orderBy = "";
	};
	
	return Sort;
});

app.factory('User', ['$http', function($http) {
	var User = {};
	var urlBase = "http://127.0.0.1:8000/";
	
	User.login = function(username, password) {
		return $http({
				url: urlBase + "login",
				method: "POST",
				data: $.param({username : username, password : password}),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};		
	
	return User;
}]);

app.filter('capitalize', function() {
	return function(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}
});

