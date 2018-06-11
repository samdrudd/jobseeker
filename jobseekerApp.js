var G = {
	MSG : {
		INFO_NO_JOBS : 100,
		ERR_DEFAULT : 400,
		ERR_USER_PASS_INVALID : 401,
		ERR_USER_PASS_REQUIRED : 402,
		ERR_USERNAME_EXISTS : 403	
	}
};

var app = angular.module('jobseeker', ['ngCookies']);

app.factory('Job', ['$http', function($http) {
	
	var Job = {};
	var urlBase = "https://murmuring-gorge-43022.herokuapp.com/";
	
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

app.factory('User', ['$http', '$cookies', function($http, $cookies) {
	var User = {};
	var urlBase = "https://murmuring-gorge-43022.herokuapp.com/";
	
	User.login = function(username, password) {
		return $http({
				url: urlBase + "login",
				method: "POST",
				data: $.param({username : username, password : password}),
				headers: { "Content-Type": "application/x-www-form-urlencoded"},
				withCredentials : true
			});
	};
	
	User.create = function(username, password) {
		return $http({
			url: urlBase + "users",
			method: "POST",
			data: $.param({username : username, password : password}),
			headers: { "Content-Type" : "application/x-www-form-urlencoded"},
			withCredentials : true
		});
	};
	
	User.logout = function() {
		$cookies.remove('jobseeker');
	};
	
	User.isLoggedIn = function() {
		return $cookies.get('jobseeker');
	};
		
	return User;
}]);

app.factory('Filter', function() {
	var Filter = {};
	
	var _status = {
		applied : true,
		interviewed : true,
		offered : true,
		rejected : true
	};
	
	var _fromDate = "";
	var _toDate = "";
	
	Filter.filter = function() {
		return {
			status : {
				applied : _status.applied,
				interviewed : _status.interviewed,
				offered : _status.offered,
				rejected : _status.rejected
			},
			fromDate : _fromDate,
			toDate : _toDate
		};
	}
	
	return Filter;
});

app.factory('Notify', function() {
	var Notify = {};
	
	_messages = {};
	_messages[G.MSG.INFO_NO_JOBS] = "No jobs yet. Add some with the 'Add Job' button above!";
	_messages[G.MSG.ERR_DEFAULT] = "An error occurred.";
	_messages[G.MSG.ERR_USER_PASS_INVALID] = "Username and / or password is incorrect.";
	_messages[G.MSG.ERR_USER_PASS_REQUIRED] = "Username and password are both required.";
	_messages[G.MSG.ERR_USERNAME_EXISTS] = "Username already exists.";
	
	_types = {};
	_types['info'] = "alert-info";
	_types['warning'] = "alert-warning";
	_types['error'] = "alert-danger";
	_types['success'] = "alert-success";
	
	_notices = {};
	
	Notify.set = function(target, type, code) {		
		_notices[target] = {
			type : _types[type],
			message : _messages[code]
		};
		
		return _notices[target];
	};
	
	Notify.get = function(target) {
		return _notices[target];
	}
	
	Notify.clear = function(target) {
		_notices[target] = {
			type : '',
			message : ''
		};
		
		return _notices[target];
	};
	
	Notify.clearAll = function() {
		_notices = {};
		
		return _notices;
	};
	
	return Notify;
});

app.filter('capitalize', function() {
	return function(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}
});

