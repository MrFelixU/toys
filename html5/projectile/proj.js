window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function drawRect(ball) {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2 );
    context.lineWidth = ball.borderWidth;
    context.strokeStyle = "#772222";
    context.stroke();
    context.fillStyle = "#11ff11";
    context.fill()
}

function animate(lastTime, ball, runAnimation) {
    if(runAnimation.value) {
        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");

        // update
        var time = new Date().getTime();
        var timeDiff = time - lastTime;

        // pixels / second
        var linearSpeed = 100;
        var linearDistEachFrame = linearSpeed * timeDiff / 1000;
        var currentX = ball.x;

        if(currentX < canvas.width) {
            var newX = currentX + linearDistEachFrame;
            ball.x = newX;
	    var t =  ball.x / linearSpeed;
	    var elevation = ball.vertu * t - 50 * t * t;
	    ball.y = canvas.height - elevation;
	    ball.borderWidth = 10 + 10 * Math.sin(newX/10);
	    drawTank();
        }
        lastTime = time;

        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw
        drawRect(ball);

        // request new frame
        requestAnimFrame(function() {
            animate(lastTime, ball, runAnimation);
        });
    }
}

function drawTank() {
    canvas = document.getElementById("myCanvas");
    c = canvas.getContext("2d");
    var tank_img = new Image();
    tank_img.onload = function(){
	c.drawImage(tank_img,0,canvas.height-50);
    };
    tank_img.src = "tank.png";
}

window.onload = function() {
    var ball = {
        x: 0,
        y: document.getElementById("myCanvas").height,
	radius: 5,
        borderWidth: 4,
	vertu : 200
    };

    /*
     * define the runAnimation boolean as an obect
     * so that it can be modified by reference
     */
    var runAnimation = {
        value: false
    };

    // add click listener to canvas
    document.getElementById("myCanvas").addEventListener("click", function() {
        // flip flag
        runAnimation.value = !runAnimation.value;

        if(runAnimation.value) {
            var time = new Date().getTime();
            animate(time, ball, runAnimation);
        }
    });
    drawRect(ball);
};
