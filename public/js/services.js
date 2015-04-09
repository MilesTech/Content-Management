angular.module('milesCommandCenter.services', []).
  factory('milesAPIservice', function($http) {

    var milesAPI = {};

    milesAPI.getTodos = function() {
      return $http({
		 method: 'Get', 
        url: '/api/todos'
      });
	  };
	  
	   milesAPI.getUsers = function() {
      return $http({
		 method: 'Get', 
        url: '/api/users'
      });
	};
	
	  milesAPI.getTeam = function() {
      return $http({
		 method: 'Get', 
        url: '/api/team'
      });
	};
	
	milesAPI.getCurrentUser = function() {
      return $http({
		 method: 'Get', 
        url: '/api/session'
      });
	};
	
	
	   milesAPI.getUser = function(id) {
      return $http({
		 method: 'Get', 
        url: '/api/users/' + id
      });
	};
	
	milesAPI.getTask = function(id) {
      return $http({
		 method: 'Get', 
        url: '/api/todos/' + id
      });
	};
	
milesAPI.getUserAccount = function() {
      return $http({
		 method: 'Get', 
        url: '/api/account/'
      });
	};
	
    return milesAPI;
  })
  
  
  .factory('loggedIn', function($http){
	  
	  var isLoggedIn = {}
	  
	  
 isLoggedIn.checkLogin = function(){
	
	var promise = $http({
		method: 'Get', 
        url: '/api/account/'
      }).success( function(user){
		 if(user.firstname){	
		 
		 $('.nav').html('<li><a href="/dashboard">Main Dashboard</a></li><li><a href="/account">My Account</a></li> <li><a href="/logout">Logout</a></li>')		
			return user;
		 } else {
			$('.nav').html('<li><a href="/login" class="home-btn">Login</a></li>')	
		 }
		 
	  });
	  return promise;
	 	  
}
	 
	 return isLoggedIn; 
  });
  
  
  