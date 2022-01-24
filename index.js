var fs = require("fs");

var CANVAS_SIZE_X = 2000;
var CANVAS_SIZE_Y = 1000;

var V_POINT_COUNT = 256;

var CURVY_OFFSET = 0.2;

var lineCode = "M0 0";
var lineHeading = [-1,-1];
var Voronoi = require("./voronoi");
var voronoi = new Voronoi();

var vPoints = [];
var vSpacing = CANVAS_SIZE_X / Math.sqrt(V_POINT_COUNT);

for(var i = 0; i < CANVAS_SIZE_X; i+=vSpacing) {
    for(var j = 0; j < CANVAS_SIZE_Y; j+=vSpacing) {
        vPoints.push({
            x: i + Math.random() * vSpacing,
            y: j + Math.random() * vSpacing
        });
    }
    
}

var vDiagram = voronoi.compute(vPoints, {
    xl: 0, xr: CANVAS_SIZE_X, yt: 0, yb: CANVAS_SIZE_Y
});

for(var j = 0; j < vDiagram.edges.length; j++) {
    var edge = vDiagram.edges[j];
    // var n1 = nodeForXY(edge.va.x, edge.va.y);
    // var n2 = nodeForXY(edge.vb.x, edge.vb.y);
    
    addCurveBetweenPoints(edge.va, edge.vb);
}

function addLineBetweenNodes(a, b) {
    var path = pathfindTo(a, b);
    
    for(var i = 1; i < path.length; i++) {
        var nFrom = hexGrid[path[i - 1]];
        var nTo = hexGrid[path[i]];
        addLine(nFrom.x, nFrom.y, nTo.x, nTo.y);
    }
}

function addCurveBetweenPoints(n1, n3) {
    var n2 = getCurveOther(n1.x, n1.y, n3.x, n3.y, CURVY_OFFSET);
    
    addCurve(n1.x, n1.y, n2.x, n2.y, n3.x, n3.y);
}

function addCurveBetweenNodes(a, b) {
    var n1 = hexGrid[a];
    var n3 = hexGrid[b];
    
    var n2 = getCurveOther(n1.x, n1.y, n3.x, n3.y, CURVY_OFFSET);
    
    addCurve(n1.x, n1.y, n2.x, n2.y, n3.x, n3.y);
}

function getCurveOther(n1x, n1y, n2x, n2y, off) {
    var mid = midpoint(n1x, n1y, n2x, n2y);
    var midx = mid[0];
    var midy = mid[1];
    
    var m = slope(n1x, n1y, n2x, n2y);
    
    var d = pythag(n1x, n1y, n2x, n2y);
    
    return {
        x: midx + Math.sin(m + Math.PI) * d * off,
        y: midy + Math.cos(m + Math.PI) * d * off
    }
    
}

function slope(n1x, n1y, n2x, n2y) {
    return Math.atan2(n2y - n1y, n2x - n1x);
}

function midpoint(n1x, n1y, n2x, n2y) {
    return [
        (n1x + n2x) / 2,
        (n1y + n2y) / 2
    ];
}

function nodeForXY(x, y) {
    var leastNodeIndex = 0;
    var leastNodeDistance = pythag(x, y, hexGrid[0].x, hexGrid[0].y);
    for(var i = 0; i < hexGrid.length; i++) {
        var node = hexGrid[i];
        var distance = pythag(x, y, node.x, node.y);
        if(distance < leastNodeDistance) {
            leastNodeIndex = i;
            leastNodeDistance = distance;
        }
    }
    return leastNodeIndex;
}

function pythag(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
}

function pathfindTo(from, to) {
    var trialFrontier = {};
    var cons = hexGrid[from].connections;
    cons.forEach(x=>trialFrontier[x]=[from,x]);
    
    while(trialFrontier[to] === undefined) {
        for(f in trialFrontier) {
            var node = hexGrid[f];
            node.connections.forEach((x,i)=>{
                var newPath = trialFrontier[f].concat([x]);
                if(trialFrontier[x] === undefined || trialFrontier[x].length > newPath.length) {
                    trialFrontier[x] = newPath;
                } 
            });
            delete trialFrontier[f];
        }
    }
    return trialFrontier[to];
}

fs.writeFileSync(__dirname + "/out.svg", `
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_SIZE_X}" height="${CANVAS_SIZE_Y}">
<path d="${lineCode}" fill="none" stroke="blue"/>
</svg>
`);

function round5(n) {
    return Math.round(n * 1000) / 1000;
}

function addLine(p1x, p1y, p2x, p2y) {
    p1x = round5(p1x);
    p1y = round5(p1y);
    p2x = round5(p2x);
    p2y = round5(p2y);

    if (lineHeading[0] != p1x || lineHeading[1] != p1y) lineCode += `M${p1x} ${p1y}`;

    lineCode += `L ${p2x} ${p2y}`;
    lineHeading = [p2x, p2y];
}
function addCurve(p1x, p1y, p2x, p2y, p3x, p3y) {
    p1x = round5(p1x);
    p1y = round5(p1y);
    p2x = round5(p2x);
    p2y = round5(p2y);
    p3x = round5(p3x);
    p3y = round5(p3y);

    if (lineHeading[0] != p1x || lineHeading[1] != p1y) lineCode += `M${p1x} ${p1y}`;

    lineCode += `Q ${p2x} ${p2y} ${p3x} ${p3y}`;
    lineHeading = [p3x, p3y];
}