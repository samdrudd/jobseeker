app.controller("jobseekerCtrl", ['$scope', '$timeout', '$filter', 'Job', 'Sort', 'Filter', 'User', 'Notify',
	function($scope, $timeout, $filter, Job, Sort, Filter, User, Notify) {
		$scope.job = {};
		$scope.sort = {};
		$scope.filter = {};
		$scope.joblist = [];
		$scope.user = {};
		$scope.notify = {};
		
		var editedJob = {};
		
		$scope.init = function() {
			$scope.job = Job.job();
			$scope.sort = Sort.sort();
			$scope.filter = Filter.filter();
						
			// If logged in already, get jobs otherwise login
			/*if (User.isLoggedIn())			
				_getJobList();
			else
				$ ('#loginModal').modal();*/

			_getJobList();
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
							$scope.notify.loginModal = Notify.set('loginModal', 'error', G.MSG.ERR_USER_PASS_INVALID);
					}
				);
		};
		
		$scope.create = function() {
			User.create($scope.user.username, $scope.user.password)
			.then(
				(response) => {
					$scope.notify.loginModal = Notify.clear('loginModal');
					$('#loginModal').modal('hide');
				},
				(response) => {
					switch (response.data.error) {
						case 10000:
							$scope.notify.loginModal = Notify.set('loginModal', 'error', G.MSG.ERR_USER_PASS_REQUIRED);
							return;
						case 11000:
							$scope.notify.loginModal = Notify.set('loginModal', 'error', G.MSG.ERR_USERNAME_EXISTS);
							return;
						default:
							$scope.notify.loginModal = Notify.set('loginModal', 'error', G.MSG.ERR_DEFAULT);
							return;
					};
				}
			);
		};
		
		$scope.logout = function() {
			if (confirm("Are you sure you want to logout?")) {
				$scope.joblist = [];
				$scope.notify = Notify.clearAll();
				User.logout();
				$('#loginModal').modal('show');
			}
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
		
		$("#loginModal").on("hide.bs.modal", function(e) {
			$timeout(function () {
				$scope.user.username = "";
				$scope.user.password = "";
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
