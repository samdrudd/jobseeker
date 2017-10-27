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
		$http({
			url: "http://127.0.0.1:8000/jobs",
			method: "POST",
			data: $.param($scope.job),
			headers: { "Content-Type": "application/x-www-form-urlencoded"}})
		.then(function successCallback(response) {
			$scope.joblist.push(response.data);
		}, function errorCallback(response) {
			console.log(response.statusText);
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
	};

	$scope.getDateString = function(date) {
		var dt = new Date(date);
		return (dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear();
	};
	
	$scope.sort = function(colname) {
		if ($scope.sorted.column !== colname) {
			$scope.sorted.column = colname;
			$scope.sorted.order = "asc";
			$scope.joblist.sort(function(a, b) {
					var x = a[colname].toLowerCase();
					var y = b[colname].toLowerCase();
					if (x < y) { return -1; }
					if (x > y) { return 1; }
					return 0;
				});
		} else {
			$scope.joblist.reverse();
			$scope.sorted.order === "asc" ? $scope.sorted.order = "desc" : $scope.sorted.order = "asc";
		}	
	};
	
	$scope.isSortedBy = function(colname) {
		return $scope.sorted.column === colname;
	};
	
	$scope.getSortedClass = function(colname) {
		if ($scope.sorted.column === colname)
			return "text-muted";
		else
			return "";
	};
	
	$scope.getSortedIcon = function(colname) {
		if ($scope.isSortedBy(colname)) {
			if ($scope.sorted.order === "asc")
				return "fa-sort-asc";
			else
				return "fa-sort-desc";
		} else
			return "fa-sort";
	};
});
