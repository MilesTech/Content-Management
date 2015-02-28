angular.module('milesCommandCenter.directives', [])

.directive('sortable', function() {

return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
		var oldid;	
    element.sortable({
	connectWith: ".todo-queue",
	distance: 10,
	items: "li",
	activate: function(e, ui){
		ui.placeholder.css({'visibility' : 'visible'})
	},
	start: function(e, ui){
		oldid = ui.item.parent('ul').attr('id')
	},
	stop: function(e, ui){
		
		
			scope.moveToBox(ui.item.attr('id'), ui.item.parent('ul').attr('id'), oldid);
			
	}
	});
 	
			
        }
    };

})

.directive('dateInput', function(dateFilter) {
return {
       require: 'ngModel',
            template: '<input type="date"></input>',
            replace: true,
            link: function(scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    return new Date(viewValue);
                });
            },
			
        }
   

})