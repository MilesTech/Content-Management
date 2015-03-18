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
  });
  
  
  