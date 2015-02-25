angular.module('milesCommandCenter.controllers', [])

/**********************************************************************
 * Main controller
 **********************************************************************/
.controller('mainController', function($scope, $http, milesAPIservice) {

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


    // delete a todo after checking it
  

})


/**********************************************************************
 * Dashboard controller
 **********************************************************************/
.controller('dashboardController', function($scope, $http, milesAPIservice, $animate, ngDialog) {
	$scope.pageClass = 'page-dashboard';
    $scope.formData = {};
	$scope.socket = io.connect('http://localhost:3000');
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
	 
	 
	 $scope.socket.on('message', function (data) {
		 $scope.$apply(function(){
			     $scope.users = data.message
		 })
   
    });
	 
	$scope.clickToOpen = function (id) {
		$scope.todoid = id
        ngDialog.open({ 
			template: '/views/task.html',
			controller: 'taskController',
			scope: $scope
		});
    };
	
	
	$scope.moveToBox = function(todoid, newUserId) {
		var todoArray=[];
		
		
		$http.post('/api/todos/' + todoid, {pull: true, assigned: newUserId || ""}).success(function(err, data){
			
			$('#' + newUserId + ' li').each(function(index, element) {
            todoArray.push($(this).attr('id'));
        });
		
		
		$http.post('/api/users/' + newUserId, {tasks:todoArray, todoId: todoid})
		.success(function(error, data){
			
			 milesAPIservice.getTeam().success(function (res) {
				
					$scope.socket.emit('send', { message: res});
	 			});

			});
			
			
			
			});
		

    };
	
	$scope.addOptions = function(todo){
		 return todo.showDelete = ! todo.showDelete;
	}
	
	
 
    $scope.createTodo = function() {
		
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
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
		var confirmed = confirm('Are you sure you want to delete this task?')
		if(confirmed){
			$http.delete('/api/todos/' + id)
				.success(function(data) {
					$scope.todos = data;
					$('#' + id).remove();
				  
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
			
	}

})

/**********************************************************************
 * User controller
 **********************************************************************/


.controller('userController', function($scope, $routeParams, $http, milesAPIservice) {
	//Scope Declarations
	$scope.pageClass = 'page-user';
	
	milesAPIservice.getUser($routeParams.userid).success(function (res) {
	 	$scope.user = res;
	 });
	
	$scope.moveToBox = function(todoId, day) {
		if(!day) day="";
		 $http.post('/api/todos/' + todoId, {day: day})
		 .success(function(data){
			milesAPIservice.getUser($routeParams.userid).success(function (res) {
				$scope.user = {};
			 });
		 });
	}
	
	$scope.doneTodo = function(id){
		var done = false;
		if($('#' + id + " input").is(':checked')){
			done= true;
		}
		
		$http.post('/api/todos/' + id, {done: done}).success(function(err, data){console.log(err)});
			milesAPIservice.getUser($routeParams.userid).success(function (res) {
	 	$scope.user = res;
	 });
	}
  

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
		
		 $http.post('/api/account/' + $scope.user._id, $scope.user)
            .success(function(data) {
                 
                $scope.user = data;
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

	milesAPIservice.getTask($scope.$parent.todoid).success(function (res) {

	 	$scope.todo = res;
	 });
});



