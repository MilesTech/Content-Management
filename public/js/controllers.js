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
	
    // when landing on the page, get all todos and show them
	
	milesAPIservice.getTodos().success(function (res) {
	 	$scope.todos = res;
	 });
	 
	 
	 milesAPIservice.getUsers().success(function (res) {
	 	$scope.users = res;
	 });
	
	$scope.moveToBox = function(todoid, newUserId) {
		
		
        for (var index = 0; index < $scope.todos.length; index++) {
 
            var item = $scope.todos[index];
            if (item._id == todoid) {
				
				$scope.updateTodo(item, newUserId);	
            }
        }

    };
 
 


	$scope.updateTodo = function(todo, newUserId){
		
		if(!newUserId){
			newUserId="";	
		} 
		
		
		$http.post('/api/todos/' + todo._id, {newAssigned: newUserId, oldAssigned: todo.assigned})
            .success(function(data) {
                 //$scope.todos = data;
				
            })
            .error(function(data) {
                console.log('Error: ' + data);
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
                console.log(data);
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
		console.log($scope.user)
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

  // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      email: $scope.user.email,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/dashboard');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
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
});