angular.module('milesCommandCenter.controllers', [])

/**********************************************************************
 * Main controller
 **********************************************************************/
.controller('mainController', function($scope, $http, milesAPIservice, $location) {

 $scope.formData = {};
	
	$scope.createUser = function(){
	$http.post('/signup', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $location.url('/account');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
	}


  

})


/**********************************************************************
 * Dashboard controller
 **********************************************************************/
.controller('dashboardController', function($scope, $http, milesAPIservice, $animate, ngDialog) {
	$scope.pageClass = 'page-dashboard';
    $scope.formData = {};
	$scope.socket = io.connect('http://localhost:3000');
	
	
	$animate.enabled(false, $('.todo-queue'));
	
//Initial Load - Get Data	
	milesAPIservice.getTodos().success(function (res) {
	 	$scope.todos = res;
	 });
	 	 
	 milesAPIservice.getTeam().success(function (res) {
	 	$scope.users = res;
	 });
	 
	  milesAPIservice.getCurrentUser().success(function (res) {
	 	$scope.session = res;
	 });




	 
//Setup Socket IO	 
	 $scope.socket.on('message', function (data) {
	
				milesAPIservice.getTodos().success(function (res) {
					$scope.todos = res;
				 });
					 
				 milesAPIservice.getTeam().success(function (res) {
					$scope.users = res;
				 });		 				 
	if(!data.created){			 	
		 if (Notification.permission === "granted" && $scope.session.user_id != data.user.user_id && $scope.session.user_id == data.newuser) {
			 	
				var notification = new Notification(data.user.user_firstname + " " + data.message, { 
						body: data.taskname, 
						icon: "/imgs/M-icon.png"
					});
			}
			else if (Notification.permission !== 'denied' && $scope.session.user_id != data.user.user_id && $scope.session.user_id == data.newuser) {
				Notification.requestPermission(function (permission) {
				  if (permission === "granted") {
					var notification = new Notification(data.user.user_firstname  + " " +  data.message, { 
						body: data.taskname, 
						icon: "/imgs/M-icon.png"
					});
				  }
				});
			}
	}
    });
	
//Opens Dialog Bpx	 
	$scope.clickToOpen = function (id) {
		$scope.todoid = id
        ngDialog.open({ 
			template: '/views/task.html',
			controller: 'taskController',
			scope: $scope
		});
    };


//Add or remove slide class to Todo generator	
	$scope.addTodoSlide = function(){	
		$('.add-todo').addClass('activate');	
	}
	
	
	//cancel create todo
	$scope.closeCreate = function(){	
		$('.activate').removeClass('activate');	
	}

	
//Drag and Drop Function	
	$scope.moveToBox = function(todoid, newUserId, oldUserId) {
		var todoArray=[];
		var options;
		
		if(newUserId == oldUserId){options = {pull: true, assigned: newUserId || false}}
		else{options ={pull: true, assigned: newUserId || false, working: false} }		
		$http.post('/api/todos/' + todoid, options)
			.success(function(err, data){

				$('#' + newUserId + ' li').each(function(index, element) {
					todoArray.push($(this).attr('id'));
				});
		
				$http.post('/api/users/' + newUserId, {tasks:todoArray, todoId: todoid})
				.success(function(err, data){	
		
			
							milesAPIservice.getUser(oldUserId).success(function (res) {
								
								$scope.updateUserHours(res)
									.success(function(){
										milesAPIservice.getTeam().success(function (team) {
											$scope.socket.emit('send', { 
											message: "added", 
											user: $scope.session, 
											newuser: newUserId, 
											taskname: $('#'+ todoid + " span:nth-child(3)").text()
											});
											
										 });
											
									});
								
							 });	
						
			});
			
				
			
			
			});
		

    };
	
	$scope.addOptions = function(todo){
		 return todo.showDelete = ! todo.showDelete;
	}
	
 
 
    $scope.createTodo = function(isValid) {
		
		if(isValid){
			switch($scope.formData.type) {
				case "mockup":
					$scope.formData.hours = 8;
					break;
				case "qa":
					$scope.formData.hours = 3;
					break;
				case "development":
					$scope.formData.hours = 12;
					break;
				case "maintenance":
					$scope.formData.hours = 2;
					break;
				case "content":
					$scope.formData.hours = 16;
					break;			
			}
				
				
			$http.post('/api/todos', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$('.activate').removeClass('activate');
					$scope.socket.emit('send', { created: true });
					
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
    };
	
	
	 

    // delete a todo after checking it
    $scope.deleteTodo = function(id, user) {
		var confirmed = confirm('Are you sure you want to delete this task?')
		if(confirmed){
			
			var userid = $('#' + id).parent('ul').attr('id')
			
			
			milesAPIservice.getUser(user).success(function (res) {
	 				$scope.updateUserHours(res, userid)
	 			});
			
			
			$http.delete('/api/todos/' + id)
				.success(function(data) {
				
					$scope.socket.emit('send', { 
						message: "removed", 
						user: $scope.session, 
						newuser: userid, 
						taskname: $('#'+ id + " span:nth-child(3)").text()
					});
				  
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
			
	}
	
	
	
	$scope.updateUserHours = function(res){
		var totalhours = 0;
		if(res.tasks){
			for(i=0; i< res.tasks.length; i++){
				if(res.tasks[i].working && !res.tasks[i].done && res.tasks[i].hours) {
					totalhours += 	res.tasks[i].hours;
				}
			}
		}

		return $http.post('/api/account/' + res._id,{hours: totalhours})
	}
	

  $scope.$on('$destroy', function (e) {
        $scope.socket.removeAllListeners();
    });

})

/**********************************************************************
 * User controller
 **********************************************************************/


.controller('userController', function($scope, $routeParams, $http, milesAPIservice, $animate) {
	
	
	//Scope Declarations
	$scope.pageClass = 'page-user';
	
	$animate.enabled(false, $('.todo-queue'));
	
	
	milesAPIservice.getUser($routeParams.userid).success(function (res) {
		
	 	$scope.user = res;
	 });
	 
//Setup Socket IO	
$scope.socket = io.connect('http://localhost:3000'); 


	$scope.socket.on('message', function (data) {
		console.log(data) 
	 });
	
	
	
	$scope.moveToBox = function(todoId, working) {
		var todoArray = [];
		
		if(!working)
		{ working=false;}
		else {working=true}
				
		$('#working li').each(function(index, element) {
					todoArray.push($(this).attr('id'));
		});
		
		$('.right-sidebar ul li').each(function(index, element) {
					todoArray.push($(this).attr('id'));
		});
		
		
		$http.post('/api/users/' + $routeParams.userid, {tasks:todoArray, todoId: todoId})
		.success(function(err){	
		
			 $http.post('/api/todos/' + todoId, {working: working})
				 .success(function(data){
					milesAPIservice.getUser($routeParams.userid).success(function (res) {
						$scope.user = res;					
						$scope.updateUserHours(res);
						});
				 });
				 
		});
	}
	
	
	
	
	$scope.showTask = function(taskid){

		milesAPIservice.getTask(taskid).success(function (res) {
	 		$scope.display = res;
	 });	
		
	}
	
	
	
	
	
$scope.doneTodo = function(id){
		var done = false;
		
		
		if($('#' + id + " input").is(':checked')){
			done= true;
			$('#' + id).addClass('done');
		} else {$('#' + id).removeClass('done'); }
		



$http.post('/api/todos/' + id, {done: done}).success(function(err, data){
		
	milesAPIservice.getUser($routeParams.userid).success(function (res) {
			$scope.user = res;

			$scope.updateUserHours(res);
	});
});	
		
	}
	
	
	
	$scope.updateUserHours = function(res){
		var totalhours = 0;
		for(i=0; i< res.tasks.length; i++){
			if(res.tasks[i].working && !res.tasks[i].done && res.tasks[i].hours) {
				totalhours += 	res.tasks[i].hours;
			}
		}

		$http.post('/api/account/' + $routeParams.userid,{hours: totalhours})
		.success(function(user){
			
				milesAPIservice.getTeam().success(function (team) {
						$scope.socket.emit('send', { message: team, user: $scope.session, newuser: ""});
				});
		})
	}
  


  $scope.$on('$destroy', function (e) {
        $scope.socket.removeAllListeners();
    });


})



/**********************************************************************
 * Register controller
 **********************************************************************/
.controller('registerController', function($scope, $http, milesAPIservice) {

     $scope.formData = {};
    // when landing on the page, get all todos and show them
	
	$scope.createUser = function(){
	$http.post('/signup', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
	}



})


/**********************************************************************
 * Login controller
 **********************************************************************/
.controller('loginController', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  

  $scope.user = {};
$scope.pageClass = 'page-login'
  // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      email: $scope.user.email,
      password: $scope.user.password,
    })
    .success(function(user){
	
      // No error: authentication OK
     
      $location.url('/dashboard');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Username or Password Not Found';
      $location.url('/login');
    });
  };
})



/**********************************************************************
 * Account controller
 **********************************************************************/
.controller('accountController', function($scope, $http, $routeParams, milesAPIservice) {
  // List of users got from the server
  $scope.user=[];
  
  milesAPIservice.getUserAccount().success(function (res) {
	 	$scope.user = res;
	 });
	 
  
  
   $scope.s3Upload = function(){
	var fullPath = document.getElementById('files').value;
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
			if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				filename = filename.substring(1);
			}
	}
	
	var status_elem = document.getElementById("status");
    var url_elem = document.getElementById("avatar_url");
    var preview_elem = document.getElementById("preview");
    var s3upload = new S3Upload({
        file_dom_selector: 'files',
        s3_sign_put_url: '/sign_s3',
		s3_object_name: filename,
        onProgress: function(percent, message) {
            status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
        },
        onFinishS3Put: function(public_url) {
            status_elem.innerHTML = 'Upload completed. Uploaded to: '+ public_url;
			$scope.user.user_img = public_url;
            preview_elem.innerHTML = '<img src="'+public_url+'" style="width:300px;" />';
        },
        onError: function(status) {
            status_elem.innerHTML = 'Upload error: ' + status;
        }
    }); 
		 
	 }
	 
  

	 
	 $scope.updateUser = function(){
		$scope.user.user_img = $('#preview').children('img').attr('src');
		
		
		 $http.post('/api/account/' + $scope.user._id, {
		 firstname: $scope.user.firstname,
		 lastname: $scope.user.lastname,
		 user_img: $scope.user.user_img,
		 })
            .success(function(data) {
                 
                $scope.user = data;
				alert("Account saved successfully")
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
	
	 }
	
	 
	 
	
  
  
  
})


/**********************************************************************
 * Logout controller
 **********************************************************************/
.controller('logoutController', function($scope, $http, $location) {
  // Fill the array to display it in the page
  $http.get('/logout').success(function(users){
	  $location.url('/')
  });
})



/**********************************************************************
 * Task controller
 **********************************************************************/
.controller('taskController', function($scope, $http, $location, milesAPIservice) {


$scope.selectOptions = ["mockup", "qa", "development", "maintenance", "content"]


	milesAPIservice.getTask($scope.$parent.todoid).success(function (res) {
	 	$scope.todo = res;
	 });
	 
	 
	 
	 $scope.saveTask = function(id){
		$http.post('/api/todos/' + id, $scope.todo).success(function(err, data){
		
		milesAPIservice.getUser($scope.todo.assigned).success(function(user){
		
			$scope.updateUserHours(user)
			milesAPIservice.getTeam().success(function (res) {
				
					$scope.socket.emit('send', { 
						message: "Edited", 
						user: $scope.session, 
						newuser: $scope.todo.assigned, 
						taskname: $scope.todo.text
					});
					
	 			});
			
			$scope.closeThisDialog();
		});
		
			
			
			});
		 		
		 
	 }
	 
	 
})


/**********************************************************************
 * Task Queue controller
 **********************************************************************/
.controller('taskQueueController', function($scope, $http, $location, milesAPIservice) {


milesAPIservice.getTodos().success(function (res) {
	 	$scope.tasks = res;
		console.log(res)
	 });
	 
	   milesAPIservice.getUserAccount().success(function (res) {
	 	$scope.user = res;
	 });

})

