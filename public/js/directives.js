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

	 .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
      priority: 10,
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var expression, options, tinyInstance,
          updateView = function () {
            ngModel.$setViewValue(elm.val());
            if (!scope.$root.$$phase) {
              scope.$apply();
            }
          };

        // generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }

        if (attrs.uiTinymce) {
          expression = scope.$eval(attrs.uiTinymce);
        } else {
          expression = {};
        }

        // make config'ed setup method available
        if (expression.setup) {
          var configSetup = expression.setup;
          delete expression.setup;
        }

        options = {
          // Update model when calling setContent (such as from the source editor popup)
          setup: function (ed) {
            var args;
            ed.on('init', function(args) {
              ngModel.$render();
              ngModel.$setPristine();
            });
            // Update model on button click
            ed.on('ExecCommand', function (e) {
              ed.save();
              updateView();
            });
            // Update model on keypress
            ed.on('KeyUp', function (e) {
              ed.save();
              updateView();
            });
            // Update model on change, i.e. copy/pasted text, plugins altering content
            ed.on('SetContent', function (e) {
              if (!e.initial && ngModel.$viewValue !== e.content) {
                ed.save();
                updateView();
              }
            });
            ed.on('blur', function(e) {
                elm.blur();
            });
            // Update model when an object has been resized (table, image)
            ed.on('ObjectResized', function (e) {
              ed.save();
              updateView();
            });
            if (configSetup) {
              configSetup(ed);
            }
          },
          mode: 'exact',
          elements: attrs.id
        };
        // extend options with initial uiTinymceConfig and options from directive attribute value
        angular.extend(options, uiTinymceConfig, expression);
        setTimeout(function () {
          tinymce.init(options);
        });

        ngModel.$render = function() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
          if (tinyInstance) {
            tinyInstance.setContent(ngModel.$viewValue || '');
          }
        };

        scope.$on('$destroy', function() {
          if (!tinyInstance) { tinyInstance = tinymce.get(attrs.id); }
          if (tinyInstance) {
            tinyInstance.remove();
            tinyInstance = null;
          }
        });
      }
    };
  }]);