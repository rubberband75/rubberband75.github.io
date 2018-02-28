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


    nextGrid = make2dArray(rows, cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            nextGrid[i][j] = nextState(grid, i, j)
        }
    }

    grid = nextGrid;
    // sleep(50);
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
            let r = floor(random(2))
            grid[i][j] = r;
        }
    }

    createCanvas(w, h);
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

// document.addEventListener("mousemove", function(e) {
//     if(e.clientY < 120) {
//     }
// });
