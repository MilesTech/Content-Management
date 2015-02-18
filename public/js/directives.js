angular.module('milesCommandCenter.directives', [])

.directive('sortable', function() {

return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
			
    element.sortable({
	connectWith: ".todo-queue",
	distance: 10,
	items: "li",
	activate: function(e, ui){
		ui.placeholder.css({'visibility' : 'visible'})
	},
	stop: function(e, ui){
		
			
			scope.moveToBox(ui.item.attr('id'), ui.item.parent('ul').attr('id'));
	
	}
	});
 	
			
        }
    };

})