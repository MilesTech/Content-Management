angular.module('milesCommandCenter.directives', [])

.directive('drag', function() {

return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
			
            element.attr("draggable", true);
            element.bind("dragstart", function(eventObject) {
                eventObject.originalEvent.dataTransfer.setData("text", attributes.id);
            });
			
        }
    };

})

.directive('dropTarget', function() {

    return {
        restrict: "A",
        link: function (scope, element, attributes, ctlr) {
         
            element.bind("dragover", function(eventObject){
                eventObject.preventDefault();
				console.log(attributes);
            });
 
            element.bind("drop", function(eventObject) {
                 
                // invoke controller/scope move method
                scope.moveToBox(eventObject.originalEvent.dataTransfer.getData("text"), attributes.id);
 
                // cancel actual UI element from dropping, since the angular will recreate a the UI element
                eventObject.preventDefault();
            });
        }
    };

})

