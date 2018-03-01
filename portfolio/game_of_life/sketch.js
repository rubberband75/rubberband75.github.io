function make2dArray(rows, cols) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    return arr;
}


let grid;
let nextGrid;
let cols;
let rows;

let canvasSize;
let canvasW;
let canvasH;
let resolution;

let running = true;
let randomFill = 0.9;

// let history = [];

function setup() {
    drawNewCanvas();
}

function draw() {
    
    background(0);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * canvasSize / resolution;
            let y = j * canvasSize / resolution;

            if (grid[j][i]) fill(255);
            else fill(0);

            stroke(8);
            strokeWeight(2);
            rect(x, y, (canvasSize / resolution) - 0, (canvasSize / resolution) - 0)
        }
    }

    if (running) {
        nextGrid = make2dArray(rows, cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                nextGrid[i][j] = nextState(grid, i, j)
            }
        }

        grid = nextGrid;

        // if(history.length < 20){
        //     history.push(grid);
        // } else if(history.length == 20){
        //     history.shift()
        //     history.push(grid);
        // }
    }
}

function nextState(grid, r, c) {
    let neighbors = 0;
    let state = grid[r][c];
    let newState;

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let nr = r + i;
            let nc = c + j;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                continue;
            } else {
                neighbors += grid[nr][nc];
            }
        }
    }
    neighbors -= int(grid[r][c]);

    if (state == 0 && neighbors == 3) {
        newState = 1;
    } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        newState = 0;
    } else {
        newState = state;
    }

    return newState;
}

function drawNewCanvas() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (h >= w) {
        canvasSize = w;
        rows = floor(h / (w / resolution));
        cols = int(resolution);

    } else {
        canvasSize = h;
        rows = int(resolution);
        cols = floor(w / (h / resolution));
    }

    grid = make2dArray(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let r = int(random(1) >= randomFill)
            grid[i][j] = r;
        }
    }

    createCanvas(w, h);

    // history = [];
}

function randomize() {
    let runnningState = running;
    running = true;
    drawNewCanvas();
    draw();
    running = runnningState;
}

function clearGrid() {
    running = false;
    let oldFill = randomFill;
    randomFill = 2;
    randomize();
    randomFill = oldFill;
}

function toggleGame() {
    running = !running;
}

function stepGeneration() {
    running = true;
    draw();
    running = false;
}

let slider = document.getElementById('myRange')
resolution = slider.value
slider.addEventListener("input", function () {
    resolution = slider.value
    drawNewCanvas()
});

let box = document.getElementById('controllBox')
box.style.top = '5px';
box.style.left = (window.innerWidth - box.offsetWidth) / 2;


window.addEventListener("resize", function () {
    drawNewCanvas();
    box.style.left = (window.innerWidth - box.offsetWidth) / 2;
});

document.addEventListener("keydown", function(event) {
    // console.log(event.which);
    switch (event.which) {
        case 32: //space
            toggleGame();
            break;
        case 39: //right arrow
            stepGeneration();
            break;
        // case 37: //left arrow
        //     if(history.length > 0){
        //         let runnningState = running;
        //         running = false;
        //         grid = history.pop();
        //         draw();
        //         running = runnningState;
        //     }
        //     break;
        case 82: //r
            randomize();
            break;
        case 67: //c
            clearGrid();
            break;
            
        case 38: //up arrow
            resolution++;
            document.getElementById('myRange').value++;
            drawNewCanvas();
            break;
        case 40: //down arrow
            if(resolution > 1){
                resolution--;
                document.getElementById('myRange').value--;
                drawNewCanvas();    
            }
            break;

        case 109: //-
            randomFill += 0.05;
            break;

        case 107: //+
            randomFill -= 0.05;
            break;
    }
});

// document.addEventListener("mousemove", function(e) {
//     if(e.clientY < 120) {
//     }
// });

document.addEventListener("mousedown", function(e) {
    let cellWidth = canvasSize / resolution;
    let ccol = floor(e.clientX/cellWidth)
    let crow = floor(e.clientY/cellWidth)
    grid[crow][ccol] = int(!grid[crow][ccol])
});