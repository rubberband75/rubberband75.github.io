let drawUpdate;
let tHeight = Math.sqrt(3) / 2;
let gridStrokeWeight = 2;

let sideLength = 25.0;
let gridHeight;
let gridWidth;

let running = false;

let grid;

function setup() {
    translate(window.innerWidth / 2, window.innerHeight / 2);
    drawGrid();
    initializeHexGrid(gridHeight, gridWidth);

    insertHexGrid(1, 1);
    insertHexGrid(-1, -1);
    insertHexGrid(2, 0);
    insertHexGrid(1, -1);

    // randomize();
}

function draw() {
    if (running) {
        getNextGeneration()
        drawUpdate = true;
    }

    if (drawUpdate) {
        drawLivecells();
        drawUpdate = false;
    }
}

function drawHexagon(x, y, r, inFill = false, fillColor = color(255)) {
    push()
    translate(x, y);

    stroke(32)
    strokeWeight(gridStrokeWeight);


    if (inFill) {
        push()
        noStroke()
        fill(fillColor)
        quad(0, r,
            -tHeight * r, r / 2,
            -tHeight * r, -r / 2,
            0, -r)

        quad(0, r,
            tHeight * r, r / 2,
            tHeight * r, -r / 2,
            0, -r)
        strokeWeight(2)
        stroke(fillColor);
        line(0, r, 0, -r)
        pop()
    }

    line(0, r, -tHeight * r, r / 2)
    line(-tHeight * r, r / 2, -tHeight * r, -r / 2)
    line(-tHeight * r, -r / 2, 0, -r)
    line(0, -r, tHeight * r, -r / 2)
    line(tHeight * r, -r / 2, tHeight * r, r / 2)
    line(tHeight * r, r / 2, 0, r)

    pop()
}

function drawHexCell(x, y, inFill = false, fillColor = color(255)) {
    drawHexagon(x * tHeight * sideLength, -y * (3 / 2.0) * sideLength, sideLength, inFill, fillColor);
}

function drawGrid() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
    translate(window.innerWidth / 2, window.innerHeight / 2);

    gridHeight = (floor(((window.innerHeight / 2.0) - (sideLength / 2.0)) / (1.5 * sideLength)) + 1) * 2 + 1
    gridWidth = Math.ceil((window.innerWidth / 2.0) / (sideLength * tHeight)) * 2 + 1

    let gridX = ((gridWidth - 1) / 2) - 1
    let gridY = (gridHeight - 1) / 2

    for (let i = -gridY; i <= gridY; i++) {
        for (let j = -gridX; j <= gridX; j++) {
            if (i % 2 == 0 && j % 2 == 0) {
                drawHexCell(j, i);
            }

            if (i % 2 && j % 2) {
                drawHexCell(j, i);
            }
        }
    }

    drawUpdate = true;
}

function drawLivecells() {
    // console.table(grid);
    drawGrid();
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let x = -(int((grid[0].length / 2)) - col);
            let y = int((grid.length / 2)) - row;

            if (grid[row][col] && ((x % 2 == 0 && y % 2 == 0) || (x % 2 && y % 2))) {
                drawHexCell(x, y, true);
            }
        }
    }
}



window.addEventListener("resize", function () {
    drawGrid();
    initializeHexGrid(gridHeight, gridWidth);
    // randomize();
});

window.addEventListener("wheel", function (e) {
    if (e.deltaY > 0 && sideLength > 5) {
        sideLength -= 1;
    } else {
        sideLength += 1;
    }
    drawGrid();
    initializeHexGrid(gridHeight, gridWidth);
    // randomize();
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

        case 39: //right arrow
            getNextGeneration();
            drawUpdate = true;
            break;

    }
});




function initializeHexGrid(rows, cols) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    grid = arr;
    drawUpdate = true;
}

function insertHexGrid(x, y) {
    x = int((grid[0].length / 2)) + x;
    y = int((grid.length / 2)) - y;

    grid[y][x] = int(!grid[y][x]);
    drawUpdate = true;
}

function countNeighbors(row, col) {
    sum = 0;

    if (row > 0 && col < grid[0].length - 2) {
        sum += grid[row - 1][col + 1];
    }
    if (col < grid[0].length - 3) {
        sum += grid[row + 0][col + 2];
    }
    if (row < grid.length - 2 && col < grid[0].length - 2) {
        sum += grid[row + 1][col + 1];
    }


    if (row < grid.length - 2 && col > 0) {
        sum += grid[row + 1][col - 1];
    }
    if (col > 1) {
        sum += grid[row + 0][col - 2];
    }
    if (row > 0 && col > 0) {
        sum += grid[row - 1][col - 1];
    }

    return sum;
}

function getNextGeneration() {
    let nextGrid = new Array(grid.length);
    for (let i = 0; i < nextGrid.length; i++) {
        nextGrid[i] = new Array(grid[0].length).fill(0);
    }

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let neighbors = countNeighbors(row, col);
            let alive = grid[row][col]

            if (!alive && neighbors == 2) {
                nextGrid[row][col] = 1;
            } else if (alive && (neighbors < 3 || neighbors > 4)) {
                nextGrid[row][col] = 0;
            } else if (alive) {
                nextGrid[row][col] = grid[row][col];
            }
        }
    }

    grid = nextGrid;
}



function randomize() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            if ((col % 2 == 0 && row % 2 == 0) || (col % 2 && row % 2)) {
                grid[row][col] = int(random(1) >= 0.7);
            }
        }
    }
    drawUpdate = true;
}
