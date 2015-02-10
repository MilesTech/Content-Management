var milesCommandCenter = angular.module('milesCommandCenter', [
'milesCommandCenter.controllers',
'milesCommandCenter.services',
'milesCommandCenter.directives',
'ngRoute'
])
.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
	
	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
	
	
	 //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
    //================================================

    //================================================
    // Define all the routes
    //================================================
	

  $routeProvider
	.when("/", {
	  templateUrl: "views/home.html", 
	  controller: "mainController"
	  })
	.when("/register", {
	  templateUrl: "views/register.html", 
	  controller: "registerController"
	  })
	.when("/login", {
	  templateUrl: "views/login.html", 
	  controller: "loginController"
	  })
	.when("/dashboard", {
	  templateUrl: "views/dashboard.html", 
	  controller: "dashboardController",
	  resolve: {
          loggedin: checkLoggedin
        }
	  })
	  
	  $locationProvider.html5Mode(true);
	  
}])

  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });