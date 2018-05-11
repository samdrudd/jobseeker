app.controller("jobseekerCtrl", ['$scope', '$http', '$timeout', 'jobFactory', 
	function($scope, $http, $timeout, jobFactory) {
		$scope.job = {};
		$scope.sort = {};
		$scope.filter = {};
		$scope.joblist = [];
		var editedJob = {};

		$scope.init = function() {
			$scope.job.date = new Date();
			$scope.sort.orderBy = '';
			$scope.sort.reverse = false;
			
			$scope.getJobList();
		};
		
		$scope.submitForm = function() {
			if ($scope.job._id)
				$scope.editJob();
			else
				$scope.addJob();
		};
		
		$scope.getJobList = function() {
			jobFactory.getAllJobs()
			.then(function successCallback(response) {
				$scope.joblist = response.data;
			}, function errorCallback(response) {
				console.log(response.statusText);
			});
		};

		$scope.addJob = function() {
			jobFactory.addJob($scope.job)
			.then(function successCallback(response) {
				$scope.joblist.push(response.data);
			}, function errorCallback(response) {
				console.log(response.statusText);
			});

			$scope.resetForm();
		};

		$scope.editJob = function() {
			var id = $scope.job._id;
			var job = {
				date :  $scope.job.date,
				title : $scope.job.title,
				company : $scope.job.company,
				location : $scope.job.location,
				via : $scope.job.via 
			};

			jobFactory.editJob(id, job)
			.then(function successCallback(response) {
				return;
			}, function errorCallback(response) {
				console.log(response.statusText);
			});
		};		
		
		$scope.openEditModal = function(job) {
			job.date = $scope.getDateString(job.date);
			
			editedJob = {
				_id : job._id,
				date :  job.date,
				title : job.title,
				company : job.company,
				location : job.location,
				via : job.via 
			};
			
			$scope.job = job;
		};
		
		var findIndexByID = function(id) {
			for (var i = 0; i < $scope.joblist.length; i++) {
				if ($scope.joblist[i]._id === id)
					return i;
			}
			
			return -1;
		}
		
		$scope.deleteJob = function(job) {
			var index = findIndexByID(job._id);
			
			jobFactory.deleteJob(job._id)
			.then(function(response) {
				$scope.joblist.splice(index, 1);
			}, function(response) {
				console.log(response.statusText);
			});
		};

		$scope.resetForm = function() {
			if ($scope.job._id)
				$scope.revertForm();
			else
				$scope.clearForm();
		};
		
		$scope.clearForm = function() {
			$scope.job = {};
			$scope.job.date = $scope.getDateString(new Date());
		};
		
		$scope.revertForm = function() {
			$scope.job._id = editedJob._id;
			$scope.job.date = editedJob.date;
			$scope.job.title = editedJob.title;
			$scope.job.company = editedJob.company;
			$scope.job.location = editedJob.location;
			$scope.job.via = editedJob.via;
		};

		$scope.getDateString = function(date) {
			var dt = new Date(date);
			return (dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear();
		};
		
		$scope.sortBy = function(colname) {
			if ($scope.sort.orderBy === colname)
				$scope.sort.reverse = !$scope.sort.reverse;
			else {
				$scope.sort.orderBy = colname;
				$scope.sort.reverse = false;
			}
		};
		
		$scope.isSortedBy = function(colname) {
			return $scope.sort.orderBy === colname;
		};
		
		$scope.getSortedClass = function(colname) {
			if ($scope.isSortedBy(colname))
				return "text-muted";
			else
				return "";
		};
		
		$scope.getSortedIcon = function(colname) {
			if ($scope.sort.reverse)
				var direction = "desc";
			else
				var direction = "asc";
			
			if ($scope.isSortedBy(colname))
				return "fa-sort-" + direction;
			else
				return "fa-sort";
		};
		
		$("#addJobModal").on("hide.bs.modal", function (e) {
			$timeout(function () {
				$scope.clearForm();
			});
		});
		
		$scope.dateFilter = function(obj) {
			if ($scope.filter.fromDate && new Date(obj.date) < new Date($scope.filter.fromDate))
				return false;
			
			if ($scope.filter.toDate && new Date(obj.date) > new Date($scope.filter.toDate))
				return false;
			
			return true;
		}
		
		$scope.resetFilters = function() {
			$scope.filter = {};
			$scope.sorted = {};
		};
	}
]);
