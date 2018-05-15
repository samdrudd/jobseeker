app.controller("jobseekerCtrl", ['$scope', '$timeout', '$filter', 'jobFactory', 
	function($scope, $timeout, $filter, jobFactory) {
		$scope.job = {};
		$scope.sort = {};
		$scope.filter = {};
		$scope.joblist = [];
		
		var editedJob = {};
		
		$scope.init = function() {
			$scope.job.date = new Date();
			$scope.job.date.setHours(0,0,0,0);
			$scope.sort.orderBy = '';
			$scope.sort.reverse = false;
			
			_getJobList();
		};
		
		$scope.submitForm = function() {
			$scope.job._id ? _editJob() : _addJob();
		};
		
		var _normalizeDates = function() {
			for (var i = 0; i < $scope.joblist.length; i++)
				$scope.joblist[i].date = new Date($scope.joblist[i].date);
		}
		
		var _getJobList = function() {
			jobFactory.getAllJobs()
				.then(
					(response) => { 
						$scope.joblist = response.data;
						_normalizeDates();
						}, 
					(response) => { console.log(response.statusText); }
				);
		};

		var _addJob = function() {
			$scope.job.date.setHours(0,0,0,0);
			
			jobFactory.addJob($scope.job)
				.then(
					(response) => { $scope.joblist.push(response.data); }, 
					(response) => { console.log(response.statusText); }
			);

			$scope.resetForm();
		};

		var _editJob = function() {
			var job = jobFactory.job($scope.job);

			jobFactory.editJob(job._id, job)
				.then(
					(response) => { $scope.joblist[_findIndexByID(job._id)] = job; }, 
					(response) => { console.log(response.statusText); }
				);
		};		
		
		$scope.openEditModal = function(job) {
			editedJob = jobFactory.job(job);
			
			$scope.job = jobFactory.job(job);
		};
		
		var _findIndexByID = function(id) {
			for (var i = 0; i < $scope.joblist.length; i++) {
				if ($scope.joblist[i]._id === id)
					return i;
			}
			
			return -1;
		}
		
		$scope.deleteJob = function(job) {
			var index = _findIndexByID(job._id);
			
			jobFactory.deleteJob(job._id)
				.then(
					(response) => { $scope.joblist.splice(index, 1); }, 
					(response) => { console.log(response.statusText); }
				);
		};

		$scope.resetForm = function() {
			$scope.job._id ? _revertForm() : _clearForm();
		};
		
		var _clearForm = function() {
			$scope.job = {};
			$scope.job.date = new Date();
		};
		
		var _revertForm = function() {
			$scope.job._id = editedJob._id;
			$scope.job.date = editedJob.date;
			$scope.job.title = editedJob.title;
			$scope.job.company = editedJob.company;
			$scope.job.location = editedJob.location;
			$scope.job.via = editedJob.via;
		};

		var _isSortedBy = function(colname) {
			return $scope.sort.orderBy === colname;
		};
		
		$scope.sortBy = function(colname) {
			if (_isSortedBy(colname))
				$scope.sort.reverse = !$scope.sort.reverse;
			else {
				$scope.sort.orderBy = colname;
				$scope.sort.reverse = false;
			}
		};
		
		$scope.getSortedClass = function(colname) {
			if (_isSortedBy(colname))
				return "text-muted";
			else
				return "";
		};
		
		$scope.getSortedIcon = function(colname) {
			if ($scope.sort.reverse)
				var direction = "desc";
			else
				var direction = "asc";
			
			if (_isSortedBy(colname))
				return "fa-sort-" + direction;
			else
				return "fa-sort";
		};
		
		$("#addJobModal").on("hide.bs.modal", function (e) {
			$timeout(function () {
				_clearForm();
			});
		});
		
		$scope.dateFilter = function(obj) {
			var jobDate = new Date(obj.date);
			return (!$scope.filter.fromDate || jobDate >= new Date($scope.filter.fromDate)) && (!$scope.filter.toDate || jobDate <= new Date($scope.filter.toDate))
		}
		
		$scope.resetFilters = function() {
			$scope.filter = {};
			$scope.sort = {};
		};
	}
]);
