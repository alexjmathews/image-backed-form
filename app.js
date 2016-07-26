var angularApp = angular.module('app', []);


angularApp.config(function() {

});

angularApp.run(function() {

});

var drawBox = function(ctx, color, position) {
    ctx.beginPath();
    ctx.rect(position[0], position[1], position[2], position[3]);
    ctx.fillStyle = color;
    ctx.fill();
}

var inputs = {};

var drawInput = function(id, inputElement, position) {
    if (!inputs[id]) {
        inputs[id] = new CanvasInput({
          canvas: document.getElementById('inputCanvas'),
          fontSize: 14,
          fontFamily: 'Arial',
          fontColor: '#212121',
          padding: 8,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 1,
          x:position[0],
          y:position[1],
          width: position[2],
          height:position[3]
        });
    } else {
        inputs[id].x(position[0])
        inputs[id].y(position[1])
        inputs[id].width(position[2])
        inputs[id].height(position[3])
    }
}


var drawLine = function(ctx, color) {
}

var inputA = {
    x_start:.225,
    x_end:.97,
    y_start:.1,
    y_end:.25
}
var inputB = {
    x_start:.07,
    x_end:.97,
    y_start:.3,
    y_end:.44
}

var draw = function () {
    var c = document.getElementById("inputCanvas");
    var i = document.getElementById("backgroundImage");

    c.width = i.clientWidth;
    c.height = i.height;

    var ctx = c.getContext("2d");

    var inputParse = function(i, width, height) {
        var out = [];
        out.push(Math.ceil(i.x_start*width ));
        out.push(Math.ceil(i.y_start*height));
        out.push(Math.ceil(i.x_end * width)  - Math.ceil(i.x_start*width ) - 20);
        out.push(Math.ceil(i.y_end * height) - Math.ceil(i.y_start*height) - 20);
        return out;
    }


    drawInput('a', c, inputParse(inputA, i.width, i.height));
    drawInput('b', c, inputParse(inputB, i.width, i.height));

}

window.addEventListener('resize', function(){
    draw();

}, false);

window.addEventListener('click', function(e){
    if (e.toElement.id == 'inputCanvas') {
        var i = document.getElementById("backgroundImage");
        console.log(e.offsetX/i.width);
        console.log(e.offsetY/i.height);
    }
}, false);

angularApp.controller('mainCtrl',  function($scope) {
    $scope.message = 'Hello world!';
    draw();
    var i = document.getElementById("backgroundImage");

    console.log(i.width);
    console.log(i.height);


});
