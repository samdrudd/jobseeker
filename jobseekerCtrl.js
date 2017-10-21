app.controller("jobseekerCtrl", function($scope, $http) {
	var today = new Date();
	$scope.job = {};
	$scope.job.dateApplied = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();

	$scope.addJob = function() {
		$http({
			url: "http://127.0.0.1:8000/jobs",
			method: "POST",
			data: $.param($scope.job),
			headers: { "Content-Type": "application/x-www-form-urlencoded"}})
		.then(function successCallback(response) {
			console.log(response.data);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});

	};

	$scope.resetForm = function() {
		$scope.job = {};
	};

});
