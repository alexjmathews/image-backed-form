var angularApp = angular.module('app', ['alexjmathews.ImageBackedInput']);


angularApp.config(function() {

});

angularApp.run(function() {

});

angularApp.controller('mainCtrl', function($scope) {
    $scope.message = 'Hello world!';
    $scope.inputModel = {
        a:"hello"
    };
});


angularApp.controller('directiveControl', function($scope) {
    $scope.backgroundImage = './test.png';
    $scope.imageInputs = {
        a: {
            x_start: .225,
            x_end: .97,
            y_start: .1,
            y_end: .25
        },
        b: {
            x_start: .07,
            x_end: .97,
            y_start: .3,
            y_end: .44
        }
    };
});
