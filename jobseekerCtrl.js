app.controller("jobseekerCtrl", ['$scope', '$timeout', '$filter', 'Job', 'Sort',
	function($scope, $timeout, $filter, Job, Sort) {
		$scope.job = {};
		$scope.sort = {};
		$scope.filter = {};
		$scope.joblist = [];
		
		var editedJob = {};
		
		$scope.init = function() {
			$scope.job.date = new Date();
			$scope.job.date.setHours(0,0,0,0);
			$scope.sort.orderBy = Sort.orderBy;
			$scope.sort.reverse = Sort.reverse;
			
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
			Job.getAllJobs()
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
			
			Job.addJob($scope.job)
				.then(
					(response) => { $scope.joblist.push(response.data); }, 
					(response) => { console.log(response.statusText); }
			);

			$scope.resetForm();
		};

		var _editJob = function() {
			var job = Job.job($scope.job);

			Job.editJob(job._id, job)
				.then(
					(response) => { $scope.joblist[_findIndexByID(job._id)] = job; }, 
					(response) => { console.log(response.statusText); }
				);
		};		
		
		$scope.openEditModal = function(job) {
			editedJob = Job.job(job);
			$scope.job = Job.job(job);
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
			
			Job.deleteJob(job._id)
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
		
		$scope.sortBy = function(colname) {
			Sort.by(colname);
			$scope.sort.orderBy = Sort.getOrder();
			$scope.sort.reverse = Sort.getReverse();
		};
		
		$scope.getSortedClass = function(colname) {
			if (Sort.isSortedBy(colname))
				return "text-muted";
			else
				return "";
		};
				
		$scope.getSortedIcon = function(colname) {
			if (Sort.getReverse())
				var direction = "desc";
			else
				var direction = "asc";
			
			if (Sort.isSortedBy(colname))
				return "fa-sort-" + direction;
			else
				return "fa-sort";
		};
		
		$("#addJobModal").on("hide.bs.modal", function (e) {
			$timeout(function () {
				_clearForm();
			});
		});
		
		$scope.dateFilter = function(job) {
			var jobDate = new Date(job.date);
			return (!$scope.filter.fromDate || jobDate >= new Date($scope.filter.fromDate)) && (!$scope.filter.toDate || jobDate <= new Date($scope.filter.toDate))
		}
		
		$scope.resetFilters = function() {
			$scope.filter = {};
			Sort.clear();
		};
	}
]);
