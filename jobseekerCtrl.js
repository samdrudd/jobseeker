app.controller("jobseekerCtrl", function($scope, $http) {
	$scope.sorted = {};
	
	$scope.init = function() {
		$scope.job = {};
		$scope.job.date = $scope.getDateString(new Date());
		$scope.joblist = [];

		$http({
			url: "http://127.0.0.1:8000/jobs",
			method: "GET"})
		.then(function successCallback(response) {
			$scope.joblist = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	};

	$scope.addJob = function() {
		var form = document.getElementById("addJobForm");
		if (!form.checkValidity())
		{
			form.classList.add("was-validated");
			return;
		}
		console.log(form);
		$http({
			url: "http://127.0.0.1:8000/jobs",
			method: "POST",
			data: $.param($scope.job),
			headers: { "Content-Type": "application/x-www-form-urlencoded"}})
		.then(function successCallback(response) {
			$scope.joblist.push(response.data);
		}, function errorCallback(response) {
			console.log(response);
		});

		$scope.resetForm();
	};

	$scope.deleteJob = function(id, index) {
		$http({
			url: "http://127.0.0.1:8000/jobs/" + id,
			method: "DELETE" })
		.then(function(response) {
			$scope.joblist.splice(index, 1);
		}, function(response) {
			console.log(response.statusText);
		});

	};

	$scope.resetForm = function() {
		$scope.job = {};
		$scope.job.date = $scope.getDateString(new Date());
		document.getElementById("addJobForm").classList.remove("was-validated");
	};

	$scope.getDateString = function(date) {
		var dt = new Date(date);
		return (dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear();
	};
	
	$scope.sort = function(colname) {
		console.log($scope.sorted);
		if ($scope.sorted.column !== colname) {
			$scope.sorted.column = colname;
			$scope.sorted.order = "des";
			$scope.joblist.sort(function(a, b) {
					var x = a[colname].toLowerCase();
					var y = b[colname].toLowerCase();
					if (x < y) { return -1; }
					if (x > y) { return 1; }
					return 0;
				});
		} else {
			$scope.joblist.reverse();
			$scope.sorted.order === "asc" ? $scope.sorted.order = "des" : $scope.sorted.order = "asc";
		}	
	};
	
	$scope.isSortedBy = function(colname) {
		return $scope.sorted.column === colname;
	};
	
});
