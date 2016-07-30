var imageInputDir = angular.module('alexjmathews.ImageBackedInput', []);

imageInputDir.controller('ImageBackedInput.mainCtrl', function(scope) {
});

var imageGlob = undefined;

    imageInputDir.directive('imageBackedInput', function($window, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './scripts/ImageBackedInput.html',
        link: function(scope, element, attr) {
            // Verify initial parameters or set to defaults
            if (!scope.image) {
                throw 'ImageBackedInput must be instantiated with an image.';
            }
            if (!scope.inputs) {
                throw 'ImageBackedInput must be instantiated with inputs.';
            }
            if (!scope.model) {
                //throw 'ImageBackedInput must be instantiated with model.';
                scope.model = {};
                for(var prop in scope.inputs) {
                    if (scope.inputs.hasOwnProperty(prop)) scope.model[prop] = '';
                }
            }
            if (!scope.maxHeight) {
                // Set to default of 300 pixels
                scope.maxImageHeight = '300';
            } else {
                scope.maxImageHeight = scope.maxHeight;
            }

            // Get and validate existence of image and canvas elements
            var imageElementTemp = element.find('img');
            var imageElement;
            if (imageElementTemp.length != 1) {
                throw 'Too many or no image elements found'
            } else {
                imageElement = imageElementTemp[0];
            }

            var canvasElementTemp = element.find('canvas');
            var canvasElement;
            if (canvasElementTemp.length != 1) {
                throw 'Too many or no canvas elements found'
            } else {
                canvasElement = canvasElementTemp[0];
            }

            // Method to update the model
            scope.updateModel = function() {
                Object.keys(scope.inputElements).forEach(function(key) {
                    scope.model[key] = scope.inputElements[key].value();
                });
                scope.$apply();
            }

            // Input Element aggregate
            scope.inputElements = {};

            // Method for drawing a single input
            // Requires a position parameter from InputParser
            var drawInput = function(id, inputElement, position) {
                if (!scope.inputElements[id]) {
                    // If the input does not exist create a new one
                    try {
                        scope.inputElements[id] = new CanvasInput({
                            canvas: inputElement,
                            fontSize: 14,
                            fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
                            fontColor: '#212121',
                            padding: 5,
                            borderWidth: 1,
                            borderColor: '#CCC',
                            borderRadius: 0,
                            innerShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)',
                            x: position[0],
                            y: position[1],
                            width: position[2],
                            height: position[3],
                            onfocus: function() {
                                scope.updateModel();
                            },
                            onblur: function() {
                                scope.updateModel();
                            },
                            onkeyup: function() {
                                scope.updateModel();
                            }
                        });
                        scope.inputElements[id].value(scope.model[id]);
                    } catch (e) {
                        // Catch DOM element not available in event canvas is too small
                        if (scope.inputElements[id]) {
                            scope.inputElements[id].destroy();
                        }
                        delete scope.inputElements[id];
                    }
                } else {
                    // Adjust positions if input element already exists
                    try {
                        scope.inputElements[id].x(position[0])
                        scope.inputElements[id].y(position[1])
                        scope.inputElements[id].width(position[2])
                        scope.inputElements[id].height(position[3])
                    } catch (e) {
                        // Catch DOM element not available in event canvas is too small
                        if (scope.inputElements[id]) {
                            scope.inputElements[id].destroy();
                        }
                        delete scope.inputElements[id];
                    }
                }
            }

            // Method to draw the entire canvas overlay
            scope.draw = function() {
                // Adjust canvas width and height to match image
                canvasElement.width = imageElement.width;
                canvasElement.height = imageElement.height;

                // Get context and draw each input
                var ctx = canvasElement.getContext("2d");
                Object.keys(scope.inputs).forEach(function(key) {
                    drawInput(key, canvasElement, inputParse(scope.inputs[key], imageElement.width, imageElement.height));
                });
            }

            // Redraw if the window starts resizing
            $window.addEventListener('resize', function() {
                scope.draw();
            }, false);

            // When the template is ready draw the overlay
            element.ready(function() {
                // Verify that the image exists
                if (imageElement.width == 0) {
                    // If it doesn't then wait for onload
                    angular.element(imageElement).on('load', function() {
                        scope.draw();
                    });
                } else {
                    // If it does ... GO GO GO
                    $timeout(function() {
                        scope.draw();
                    });
                }
            });
        },
        scope: {
            image: '=',
            maxHeight: '=',
            inputs: '=',
            someArray: "=",
            model: '='
        }
    };
});

var inputParse = function(i, width, height) {
    var paddingAdjustment = 20;

    var out = [];
    out.push(Math.ceil(i.x_start * width));
    out.push(Math.ceil(i.y_start * height));
    out.push(Math.ceil(i.x_end * width) - Math.ceil(i.x_start * width) - paddingAdjustment);
    out.push(Math.ceil(i.y_end * height) - Math.ceil(i.y_start * height) - paddingAdjustment);
    return out;
}
