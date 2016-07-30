var angularApp = angular.module('app', ['schemaForm', 'alexjmathews.ImageBackedInput']);


angularApp.config(function() {});
angularApp.run(function() {});

angularApp.controller('mainCtrl', function($scope) {
    $scope.schema = {
        type: "object",
        properties: {
            name: {
                type: "string",
                title: "Name",
            },
            test: {
                title: "Measurements",
                type: "object",
                format: "form-image",
                image: "./test.png",
                inputs: {
                    "patient_name": {
                        x_start: .225,
                        x_end: .97,
                        y_start: .1,
                        y_end: .25
                    },
                    "dx": {
                        x_start: .07,
                        x_end: .97,
                        y_start: .3,
                        y_end: .44
                    }
                }
            }
        }
    };

    $scope.form = ["*"];
    $scope.model = {};
});
