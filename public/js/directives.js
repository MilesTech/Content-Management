angular.module('milesCommandCenter.directives', [])

.directive('drags', function() {

return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
			
            /*element.attr("draggable", true);
            element.bind("dragstart", function(eventObject) {
                eventObject.originalEvent.dataTransfer.setData("text", attributes.id);
            });*/
			
			 element.draggable({

});
 
			
        }
    };

})

.directive('dropTargets', function() {

    return {
        restrict: "A",
        link: function (scope, element, attributes, ctlr) {
         
		 	 element.droppable({
			accept: ".queue-item",
			drop: function(e, ui){
		
				//scope.moveToBox(ui.draggable.attr('id'), element.attr('id') );
   }
});
		 
		 		 
            /*element.bind("dragover", function(eventObject){
                eventObject.preventDefault();
			});
				
 
            element.bind("drop", function(eventObject) {
          
                // invoke controller/scope move method
                scope.moveToBox(eventObject.originalEvent.dataTransfer.getData("text"), attributes.id);
 
                // cancel actual UI element from dropping, since the angular will recreate a the UI element
                eventObject.preventDefault();
            });*/
        }
    };

})



.directive('sortable', function() {

return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
			
    element.sortable({
	connectWith: ".todo-queue",
	distance: 10,
	items: "ul li",
	activate: function(e, ui){
		ui.placeholder.css({'visibility' : 'visible'})
	},
	stop: function(e, ui){
		//var data = $(this).attributes.sortable('serialize');
		console.log($(this))	
	}
	});
 	
			
        }
    };

})