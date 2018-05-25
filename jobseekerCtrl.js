app.controller("jobseekerCtrl", ['$scope', '$timeout', '$filter', 'Job', 'Sort', 'Filter', 'User',
	function($scope, $timeout, $filter, Job, Sort, Filter, User) {
		$scope.job = {};
		$scope.sort = {};
		$scope.filter = {};
		$scope.joblist = [];
		$scope.user = {};
		$scope.error = "";
		
		var editedJob = {};
		
		$scope.init = function() {
			$scope.job = Job.job();
			$scope.sort = Sort.sort();
			$scope.filter = Filter.filter();
			
			// If logged in already, get jobs otherwise login
			if (User.isLoggedIn())			
				_getJobList();
			else
				$ ('#loginModal').modal();
			
		};
		
		$scope.submitForm = function() {
			$scope.job._id ? _editJob(Job.job($scope.job)) : _addJob();
		};
		
		var _normalizeDates = function() {
			for (var i = 0; i < $scope.joblist.length; i++) {
				$scope.joblist[i].date = new Date($scope.joblist[i].date);
				$scope.joblist[i].date.setHours(0,0,0,0);
			}
		}
		
		// If login is successful, get jobs
		$scope.login = function() {
			User.login($scope.user.username, $scope.user.password)
				.then(
					(response) => { 
						$ ('#loginModal').modal('hide');
						_getJobList();
					},
					(response) => { 
						if (response.status === 403)
							$scope.error = "Username and / or password is incorrect.";
					}
				);
		};
		
		$scope.create = function() {
			User.create($scope.user.username, $scope.user.password)
			.then(
				(response) => {
					console.log(response);
				},
				(response) => {
					switch (response.data.error) {
						case 10000:
							$scope.error = "Username and password are both required.";
							return;
						case 11000:
							$scope.error = "Username already exists.";
							return;
						default:
							$scope.error = "An error occurred.";
					};
				}
			);
		};
		
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

		var _editJob = function(job) {
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
			$scope.job = Job.job();
		};
		
		var _revertForm = function() {
			$scope.job = Job.job(editedJob);
		};
		
		$scope.sortBy = function(colname) {
			Sort.by(colname);
			$scope.sort = Sort.sort();
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
		
		$scope.getStatusClass = function(status) {
			switch (status) {
				case "applied":
					return "btn-outline-info";
				case "interviewed":
					return "btn-outline-primary";
				case "offered":
					return "btn-outline-success";
				case "rejected":
					return "btn-outline-danger";
				default:
					return "btn-outline-secondary";
			}
		};
		
		$("#addJobModal").on("hide.bs.modal", function (e) {
			$timeout(function () {
				_clearForm();
			});
		});
		
		$scope.dateFilter = function(job) {
			var jobDate = new Date(job.date);
			return (!$scope.filter.fromDate || jobDate >= new Date($scope.filter.fromDate)) && (!$scope.filter.toDate || jobDate <= new Date($scope.filter.toDate))
		};
		
		$scope.statusFilter = function(job) {
			return $scope.filter.status[job.status];
		};
		
		$scope.changeJobStatus = function(job, status) {
			var change = Job.job(job);
			change.status = status;
			
			_editJob(change);
		};
		
		$scope.applyStatusFilter = function(status) {
			$scope.filter.status[status] = !$scope.filter.status[status];
		}
		
		$scope.resetFilters = function() {
			Sort.clear();
			$scope.sort = Sort.sort();
			
			$scope.filter = Filter.filter();
		};
	}
]);
