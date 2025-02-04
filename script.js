
// Létrehozunk egy 10 x 14-es mátrixot, amely tartalmazza a pontok koordinátáit
var points = [];
var clickedPoints = [];
var clicksNumber = 0;
var numRows = 15;
var numCols = 10;
var firstColCord = 0;
var lastColCord = 0;
var ended = 0;

for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
        points.push({
            x: col * 35 + 20,
            y: row * 35 + 20
        });
        if (col == 0) { firstColCord = col * 35 + 20; }
        if (col == numCols - 1) { lastColCord = col * 35 + 20; }
    }
}

// A HTML canvas elem kiválasztása
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

// A canvas méretének beállítása
canvas.width = numCols * 35;
canvas.height = numRows * 35;

// A pontok kirajzolása a vásznon
function drawP(p) {
    for (var i = 0; i < p.length; i++) {
        context.beginPath();
        context.arc(p[i].x - 2, p[i].y - 2, 15, 0, 2 * Math.PI, false);
        context.fillStyle = "#92b64a";
        context.fill();
    }
}
function drawPoints() {
    drawP(points);
}

function drawPointsAtTheEnd() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawP(clickedPoints);
    drawLines();
    setTimeout(() => { canvas.style.filter = "blur(5px)"; }, 1000);
    setTimeout(() => {
        hide();
        context.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("main").style.backgroundImage = "url('aidea.png')"
        drawP(clickedPoints);
        drawLines();
        canvas.addEventListener("touchstart", function (e) {
            var container = document.getElementById("main");
                html2canvas(container, { allowTaint: true }).then(function (canvas) {
                    var link = document.createElement("a");
                    document.body.appendChild(link);
                    link.download = "aidea.png";
                    link.href = canvas.toDataURL();
                    link.target = '_blank';
                    link.click();
                });
        });
    }, 4000);

}

function hide() {
    var x = document.getElementById("footer");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// A vonalak kirajzolása a vásznon
function drawLines() {
    context.strokeStyle = "#92b64a";
    context.lineWidth = 3;
    context.lineCap = "round";

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        context.beginPath();
        context.moveTo(line.start.x, line.start.y);
        context.lineTo(line.end.x, line.end.y);
        context.stroke();
    }
}

var lastClickedPoint = null;

// Az érintés kezelése
function handleTouchStart(evt) {
    if (ended == 0) {
        var touch = evt.touches[0];
        var x = touch.pageX - canvas.offsetLeft;
        var y = touch.pageY - canvas.offsetTop;
        var clickedPoint = findNearestPoint(x, y);
        if (clicksNumber == 0) {
            if (clickedPoint.x == firstColCord) {
                handleTouch(clickedPoint);
            }
            else {
                alert("Az első oszlopból kell hogy indulj!");
            }
        }
        else {
            handleTouch(clickedPoint);
            if (clickedPoint.x == lastColCord) {
                ended = 1;
                drawPointsAtTheEnd();
            }
        }

    }
}
function handleTouch(clickedPoint) {
    if (lastClickedPoint !== null && clickedPoint !== lastClickedPoint) {
        lines.push({
            start: lastClickedPoint,
            end: clickedPoint
        });
        draw();
    }
    lastClickedPoint = clickedPoint;

    clickedPoints.push({
        x: lastClickedPoint.x,
        y: lastClickedPoint.y
    });

    clicksNumber++;
}

function findNearestPoint(x, y) {
    var minDistance = Infinity;
    var nearestPoint = null;
    for (var i = 0; i < points.length; i++) {
        var distance = Math.sqrt(Math.pow(points[i].x - x, 2) + Math.pow(points[i].y - y, 2));
        if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = points[i];
        }
    }
    return nearestPoint;
}
function handleTouchMove(evt) {
    evt.preventDefault();

    var touch = evt.touches[0];
    var x = touch.pageX - canvas.offsetLeft;
    var y = touch.pageY - canvas.offsetTop;

    activeLineEnd = {
        x: x,
        y: y
    };

    draw();
}

// A vászon újrarajzolása
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints();
    drawLines();
}

// Az aktív vonal kezdőpontja
var activeLineStart = null;

// A megrajzolt vonalak listája
var lines = [];

// Az érintéskezelő hozzáadása a canvas-hez
const mq = window.matchMedia( "(min-width: 700px)" );
if(mq.matches){
    canvas.addEventListener("touchstart", handleTouchStart, false);
}else{
    canvas.addEventListener("touchstart", handleTouchStart, true);
}

// Az első rajzolás
draw();

