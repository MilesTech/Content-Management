angular.module('milesCommandCenter.controllers', [])

/**********************************************************************
 * Main controller
 **********************************************************************/
.controller('mainController', function($scope, $http, milesAPIservice) {



    // delete a todo after checking it
  

})


/**********************************************************************
 * Dashboard controller
 **********************************************************************/
.controller('dashboardController', function($scope, $http, milesAPIservice, $animate) {
	$scope.pageClass = 'page-dashboard';
     $scope.formData = {};
	$scope.socket = io.connect('http://localhost:3000');
 
   
 
		
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
	   console.log($scope.users);
		 })
   
    });
	 
	
	$scope.moveToBox = function(todoid, newUserId) {
		var todoArray=[];
		$http.post('/api/todos/' + todoid, {pull: true}).success(function(err, data){});
		
		$('#' + newUserId + ' li').each(function(index, element) {
            todoArray.push($(this).attr('id'));
        });
		
		
		$http.post('/api/users/' + newUserId, {tasks:todoArray, todoId: todoid})
		.success(function(err, data){
			
			 milesAPIservice.getTeam().success(function (res) {
					$scope.users = res;
					$scope.socket.emit('send', { message: res});
	 			});
			
			
			});
		

    };
 
	
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
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
              
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
			
	}

})

/**********************************************************************
 * User controller
 **********************************************************************/


.controller('userController', function($scope, $routeParams, $http, milesAPIservice) {
	
 

	
	$scope.pageClass = 'page-user';
	
	milesAPIservice.getUser($routeParams.userid).success(function (res) {
	 	$scope.user = res;
		
	 });
	
	$scope.moveToBox = function(todoId, day) {
		if(!day) day="";
		 $http.post('/api/todos/' + todoId, {day: day})
		 .success(function(data){
			 
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
 * Admin controller
 **********************************************************************/
.controller('AdminController', function($scope, $http) {
  // List of users got from the server
  $scope.users = [];

  // Fill the array to display it in the page
  $http.get('/users').success(function(users){
    for (var i in users)
      $scope.users.push(users[i]);
  });
})


/**********************************************************************
 * Admin controller
 **********************************************************************/
.controller('logoutController', function($scope, $http, $location) {
  // Fill the array to display it in the page
  $http.get('/logout').success(function(users){
	  $location.url('/')
  });
});


