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
	
  

    return milesAPI;
  });
  
  
  