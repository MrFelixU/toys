var vertices = [ [281, 40], [600, 321], [59, 296],  [0,14], [160,479], [240,380], [539,429] ];
var curX = 0;
var curY = 0;


function startup() {
    var canvas = document.getElementById('the_canvas');
    var context = canvas.getContext('2d');
    curX = canvas.width / 2;
    curY = canvas.height / 2;
    

}

function go(times) {
    for (var i=0; i < times; i++) {
	dot();
    } 
}

function dot(){
    var canvas = document.getElementById('the_canvas');
    var context = canvas.getContext('2d');

    vindex = Math.floor(Math.random()*3);
    vertex = vertices[vindex];
    curX = (curX + vertex[0]) / 2;
    curY = (curY + vertex[1]) / 2;


    // colour fun!
	var greint = Math.floor(256 * curX / canvas.width);
	var bluint = Math.floor(256 * curY / canvas.height);


    // draw a dot
    context.beginPath();
    context.moveTo(curX, curY);
    context.lineTo(curX+1, curY);
    context.lineWidth = 2;
    context.strokeStyle = "#" + "00" + greint.toString(16) + bluint.toString(16);
    context.stroke();
}

