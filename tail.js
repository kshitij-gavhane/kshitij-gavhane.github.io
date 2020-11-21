// This includes all Tail properties and draw function.

// this.speed,
// this.pLen (normal length),
// this.mLen (max Length)

var Tail = function(mx, my) {
    this.pList = [];
    this.pLen = 30;
    this.mLen = 70;
    this.mx = mx;
    this.my = my;
    this.destX = 0;
    this.destY = 0;
    this.speed = 7;
    this.updateCrds = function() {
        if (this.destY != 0) {
            this.mx += (this.destX - this.mx) / this.speed;
            this.my += (this.destY - this.my) / this.speed;
        }

    };
};

function gradient(a, b) {
    return (b.y - a.y) / (b.x - a.x);
}

function bzCurve(points, f, t) {
    if (typeof(f) == 'undefined') f = 0.3;
    if (typeof(t) == 'undefined') t = 0.6;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    var m = 0;
    var dx1 = 0;
    var dy1 = 0;

    var preP = points[0];
    for (var i = 1; i < points.length; i++) {
        var curP = points[i];
        nexP = points[i + 1];
        if (nexP) {
            m = gradient(preP, nexP);
            dx2 = (nexP.x - curP.x) * -f;
            dy2 = dx2 * m * t;
        } else {
            dx2 = 0;
            dy2 = 0;
        }
        ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
        dx1 = dx2;
        dy1 = dy2;
        preP = curP;
    }
    ctx.stroke();
}

window.onload = function() {
    var tail;

    document.addEventListener("mousemove", moveMent);

    function moveMent(e) {
        if (tail) {
            tail.destX = e.clientX;
            tail.destY = e.clientY;
        } else {
            tail = new Tail(e.clientX, e.clientY);
        }
    }
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    setInterval(function() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (tail) {
            // Update top point
            tail.updateCrds();

            // Push current position
            tail.pList.push({ x: tail.mx, y: tail.my });

            // Draw tail
            points = [];
            for (var i = 0; i < tail.pList.length; i++) {
                points.push({x:tail.pList[i].x, y:tail.pList[i].y});
            }
            bzCurve(points, 0.1, 1);
            // ctx.stroke();

            // move them to the flow
            for (var i = 0; i < tail.pList.length; i++) {
                tail.pList[i].x -= 2;
                tail.pList[i].y += 2;
            }

            // Remove extra tail
            while (tail.pList.length > tail.pLen) {
                tail.pList.shift();
                if (tail.pList.length > tail.mLen) {
                	for (var i = 0; i < 5; i++) {
                		tail.pList.shift();
                	}
                }
            }
        }
    }, 1000 / 30);
};