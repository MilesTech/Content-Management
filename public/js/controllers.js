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
.controller('dashboardController', function($scope, $http, milesAPIservice) {

     $scope.formData = {};
	 
    // when landing on the page, get all todos and show them
	
	milesAPIservice.getTodos().success(function (res) {
	 	$scope.todos = res;
	 });
	 
	 
	 milesAPIservice.getUsers().success(function (res) {
	 	$scope.users = res;
	 });
	
	$scope.moveToBox = function(todoid, userid) {
        for (var index = 0; index < $scope.todos.length; index++) {
 
            var item = $scope.todos[index];
            if (item._id == todoid) {
				$scope.updateTodo(item, userid);	
            }
        }

    };
 

	$scope.updateTodo = function(todo, userid){
		
		$http.post('/api/todos/' + todo._id, {assigned: userid})
            .success(function(data) {
                 $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
	};
	

    $scope.createTodo = function() {
		
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