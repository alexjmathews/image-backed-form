var imageInputDir = angular.module('alexjmathews.ImageBackedInput', []);

imageInputDir.controller('ImageBackedInput.mainCtrl', function(scope) {
    scope.someArray = [];
    scope.someArray.push(1);
    scope.someArray.push(2);
    scope.someArray.push(3);
});
var modelOutput = {};
imageInputDir.directive('imageBackedInput', function($window, $timeout) {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            // Verify initial parameters or set to defaults

            if (!scope.image) {
                throw 'ImageBackedInput must be instantiated with an image.';
            }
            if (!scope.inputs) {
                throw 'ImageBackedInput must be instantiated with inputs.';
            }
            // if (!scope.model) {
            //     throw 'ImageBackedInput must be instantiated with model.';
            // } else {
            //     console.log(scope.model);
            // }
            if (!scope.maxHeight) {
                // Set to default of 300 pixels
                scope.maxImageHeight = '300';
            } else {
                scope.maxImageHeight = scope.maxHeight;
            }
            // Get and validate existence of image and canvas elements
            var imageElementTemp = element.find('img');
            scope.imageElementTemp = imageElementTemp;
            var canvasElementTemp = element.find('canvas');
            var imageElement;
            if (imageElementTemp.length != 1) {
                throw 'Too many or no canvas elements found'
            } else {
                imageElement = imageElementTemp[0];
            }

            var canvasElement;
            if (canvasElementTemp.length != 1) {
                throw 'Too many or no canvas elements found'
            } else {
                canvasElement = canvasElementTemp[0];
            }

            scope.inputElements = {};

            scope.updateModel = function() {
                Object.keys(scope.inputElements).forEach(function(key) {
                    scope.model[key] = scope.inputElements[key].value();
                });
                scope.$apply();
            }

            var drawInput = function(id, inputElement, position) {
                if (!scope.inputElements[id]) {
                    try {
                        scope.inputElements[id] = new CanvasInput({
                            canvas: inputElement,
                            fontSize: 14,
                            fontFamily: 'Arial',
                            fontColor: '#212121',
                            padding: 5,
                            borderWidth: 1,
                            borderColor: '#000',
                            borderRadius: 1,
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
                        if (scope.inputElements[id]) {
                            scope.inputElements[id].destroy();
                        }
                        delete scope.inputElements[id];
                    } finally {

                    }

                } else {
                    try {
                        scope.inputElements[id].x(position[0])
                        scope.inputElements[id].y(position[1])
                        scope.inputElements[id].width(position[2])
                        scope.inputElements[id].height(position[3])
                    } catch (e) {
                        if (scope.inputElements[id]) {
                            scope.inputElements[id].destroy();
                        }
                        delete scope.inputElements[id];
                    } finally {

                    }
                }
            }

            scope.draw = function() {
                canvasElement.width = imageElement.width;
                canvasElement.height = imageElement.height;

                var ctx = canvasElement.getContext("2d");

                Object.keys(scope.inputs).forEach(function(key) {
                    drawInput(key, canvasElement, inputParse(scope.inputs[key], imageElement.width, imageElement.height));
                });
            }

            $window.addEventListener('resize', function() {
                scope.draw();
            }, false);

            element.ready(function() {
                $timeout(function() {
                    scope.draw();
                    Object.keys(scope.inputElements).forEach(function(key) {
                        scope.inputElements[key].value(scope.model[key]);
                    });
                });
            });
        },
        scope: {
            image: '=',
            maxHeight: '=',
            inputs: '=',
            someArray: "=",
            model: '='
        },
        templateUrl: '/scripts/imageBackedInput.html'
    };
});

var inputParse = function(i, width, height) {
    var out = [];
    out.push(Math.ceil(i.x_start * width));
    out.push(Math.ceil(i.y_start * height));
    out.push(Math.ceil(i.x_end * width) - Math.ceil(i.x_start * width) - 20);
    out.push(Math.ceil(i.y_end * height) - Math.ceil(i.y_start * height) - 20);
    return out;
}
