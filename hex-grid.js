module.exports = function(width, height, sideLength) {
    var grid = [];
    findOrCreateAtCoords(0, 0, 1, grid);
    
    var finishedIndex = 0, oldGridSize;
    while(true) {
        for(var i = finishedIndex; i < grid.length; i++) {
            if(grid[i].__connected) {
                finishedIndex = i;
            } else {
                populateConnections(i, sideLength, grid, width, height);
                grid[i].__connected = true;
            }
            if(!((i >>> 4) & 1) && i) console.log("Populated " + finishedIndex + " hex nodes!");
        }
        console.log("Populated " + finishedIndex + " hex nodes!");
        
        if(oldGridSize == grid.length && finishedIndex + 1 == grid.length) break;
        
        oldGridSize = grid.length;
    }
    for(var i = 0; i < grid.length; i++) {
        delete grid[i].__connected;
    }
    return grid;
}

function populateConnections(nodeIndex, sideLength, grid, width, height) {
    if(nodeIndex < 0) throw "sub-0 connection index!";
    var node = grid[nodeIndex];
    for(var i = 3; i >= -5; i -= 4) {
        var angle = (Math.PI) * (i / 6);
        if(node.face < 0) angle += Math.PI;
        
        var popX = node.x + Math.cos(angle) * sideLength;
        var popY = node.y + Math.sin(angle) * sideLength;
        
        popX = r5(popX);
        popY = r5(popY);
        
        if(popX < 0 || popX > width ||
            popY < 0 || popY > height) continue;
        
        var con = findOrCreateAtCoords(popX, popY, node.face * -1, grid);
        connect(nodeIndex, con, grid, sideLength);
    }
}

function r5 (n) {
    return Math.round(n * 10000) / 10000 + 0;
}

function pythag(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
}

function connect(n1i, n2i, grid, sideLength) {
    var n1 = grid[n1i], n2 = grid[n2i];
    
    if(pythag(n1.x, n1.y, n2.x, n2.y)  - 0.01 > sideLength) return;
    
    if(n1.connections.indexOf(n2i) == -1) n1.connections.push(n2i);
    if(n2.connections.indexOf(n1i) == -1) n2.connections.push(n1i);
}

function findOrCreateAtCoords(x,y, face, grid) {
    var found = findAtCoords(x,y,grid);
    if(found != -1) return found;
    
    var i = grid.length;
    var g = {
        i: i,
        x: x,
        y: y,
        face: face,
        connections: []
    };
    grid.push(g);
    return i;
}

function findAtCoords(x,y,grid) {
    var ELIPSON = 0.000001;
    return grid.findIndex(node=> 
        Math.abs(node.x - x) < ELIPSON &&
        Math.abs(node.y - y) < ELIPSON
    );
}