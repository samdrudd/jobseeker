app.controller("jobseekerCtrl", function($scope, $http) {

	$scope.init = function() {
		$scope.job = {};
		$scope.job.date = $scope.getDateString(new Date());
		$scope.joblist = [];

		$http({
			url: "http://127.0.0.1:8000/jobs",
			method: "GET",
			headers: {"Content-Type": "application/x-www-form-urlencoded"} })
		.then(function successCallback(response) {
			console.log(response.data);
			$scope.joblist = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	};

	$scope.addJob = function() {
		console.log($scope.job);
		var jobobj = $scope.getJobObject($scope.job);

		$http({
			url: "http://127.0.0.1:8000/jobs",
			method: "POST",
			data: $.param($scope.job),
			headers: { "Content-Type": "application/x-www-form-urlencoded"}})
		.then(function successCallback(response) {
			console.log(response.data);
			$scope.joblist.push(jobobj);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});

		$scope.resetForm();

	};

	$scope.resetForm = function() {
		$scope.job = {};
		$scope.job.date = $scope.getDateString(new Date());
	};

	$scope.getDateString = function(date) {
		var dt = new Date(date);
		return (dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear();
	};

	$scope.getJobObject = function(job) {
		return { date : job.date, title : job.title, company : job.company, location : job.location, via : job.via };
	};

});
