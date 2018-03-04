
let tHeight = Math.sqrt(3) / 2;
let cellHeight;

let gridStrokeWeight = 2;

let sideLength = 30.0;
let gridHeight;
let gridWidth;

let running = true;
let drawUpdate;

let grid;

function setup() {
    initializeGrid();
    // setStartPattern();
    randomize();
}

function draw() {
    drawLivecells();

    if(running){
        getNextGeneration();
    }
}

function makeArray(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    return arr;
}

function drawTriangle(x, y, down = false, fillIn = false) {
    stroke(32);
    strokeWeight(gridStrokeWeight);
    noFill();

    let x1 = x - sideLength / 2;
    let x2 = x;
    let x3 = x + sideLength / 2;
    let y2;

    if (!down) {
        y2 = y;
        y = cellHeight + y2;

    } else {
        y2 = cellHeight + y;
    }

    if (fillIn) {
        push()
        noStroke();
        fill(fillIn);
        triangle(x1, y, x2, y2, x3, y)
        pop()
    }

    triangle(x1, y, x2, y2, x3, y)
}

function getDir(r, c) {
    let dir;
    let tl_down = (((grid.length / 2) % 2) + (floor(grid[0].length / 2) % 2)) % 2

    if (tl_down) {
        dir = !((r % 2 + c % 2) % 2);
    } else {
        dir = ((r % 2 + c % 2) % 2);
    }

    return dir;
}

function initializeGrid(){
    cellHeight = tHeight * sideLength;
    gridWidth = Math.ceil((window.innerWidth/2) / (sideLength/2))*2 + 1;
    gridHeight = Math.ceil((window.innerHeight/2) / cellHeight)*2;
    grid = makeArray(gridHeight, gridWidth);

    drawGrid();
}

function drawGrid() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
    translate(window.innerWidth / 2, window.innerHeight / 2);
    cellHeight = tHeight * sideLength;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            let x = (c - floor(grid[0].length / 2)) * sideLength / 2;
            let y = (r - grid.length / 2) * cellHeight;
            drawTriangle(x, y, getDir(r, c))
        }
    }
}

function drawLivecells() {
    drawGrid();
    // translate(window.innerWidth / 2, window.innerHeight / 2);
    
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if(grid[row][col]){
                let x = (col - floor(grid[0].length / 2)) * sideLength / 2;
                let y = (row - grid.length / 2) * cellHeight;
                drawTriangle(x, y, getDir(row, col), color(255))
            }
        }
    }
}



window.addEventListener("resize", function () {
    initializeGrid();
});

window.addEventListener("wheel", function (e) {
    if (e.deltaY > 0 && sideLength > 5) {
        sideLength -= 1;
    } else {
        sideLength += 1;
    }
    initializeGrid();
});

document.addEventListener("keydown", function (event) {
    // console.log(event.which);
    switch (event.which) {
    case 32: //space
        running = !running;
        break;

    case 82: //r
        randomize();
        break;

    case 67: //c
        initializeGrid();
        break;

    case 39: //right arrow
        getNextGeneration();
        break;
    }
});



function randomize() {

    grid = makeArray(gridHeight, gridWidth);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            grid[row][col] = int(random(1) >= 0.7);
        }
    }
}

function countNeighbors(row, col){
    let dir = getDir(row, col);
    let sum = 0;

    if(row > 0 && col > 0){
        sum += grid[row-1][col-1]
    }
    if(row > 0){
        sum += grid[row-1][col]
    }
    if(row > 0 && col < grid[0].length - 2){
        sum += grid[row-1][col+1]
    }


    if(col > 0){
        sum += grid[row][col-1]
    }
    if(col < grid[0].length - 2){
        sum += grid[row][col+1]
    }


    if(row < grid.length - 2 && col > 0){
        sum += grid[row+1][col-1]
    }
    if(row < grid.length - 2){
        sum += grid[row+1][col]
    }
    if(row < grid.length - 2 && col < grid[0].length - 2){
        sum += grid[row+1][col+1]
    }


    if(col > 1){
        sum += grid[row][col-2]
    }
    if(col < grid[0].length - 3){
        sum += grid[row][col+2]
    }


    if(dir){ // pointed down
        if(row > 0 && col > 1){
            sum += grid[row-1][col-2]
        }
        if(row > 0 && col < grid[0].length - 3){
            sum += grid[row-1][col+2]
        }
    } else { // pointed up
        if(row < grid.length - 2 && col > 1){
            sum += grid[row+1][col-2]
        }
        if(row < grid.length - 2 && col < grid[0].length - 3){
            sum += grid[row+1][col+2]
        }
    }

    return sum;
}

function getNextGeneration(){
    let nextGrid = makeArray(grid.length, grid[0].length);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let neighbors = countNeighbors(row, col);
            let alive = grid[row][col];

            if (!alive && (neighbors >= 5 && neighbors <= 6)) {
                nextGrid[row][col] = 1;
            } else if (alive && (neighbors < 4 || neighbors > 7)) {
                nextGrid[row][col] = 0;
            } else if (alive) {
                nextGrid[row][col] = grid[row][col];
            }
        }
    }

    grid = nextGrid;
}

function setStartPattern() {
    pattern = [

        [-1, -1],
        // [-1,  0],
        [-1,  1],

        [ 0, -1],
        [ 0,  0],
        [ 0,  1],
    ];

    for (let i = 0; i < pattern.length; i++) {
        let r = (grid.length / 2) + pattern[i][0]
        let c = ((grid[0].length - 1) / 2) + pattern[i][1]

        console.log([r, c])

        grid[r][c] = 1;
    }

}