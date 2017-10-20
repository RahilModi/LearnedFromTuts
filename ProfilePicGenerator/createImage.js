const fs = require('fs');
const PNG = require('pngjs').PNG;

const game_of_life = require('./GOL');

const FINAL_IMAGE_SIZE = 256;

let options = {
    cellSize: 32,
    iterations: 5,
};

const DEAD = game_of_life.DEAD;

const createPNG = (seed) =>{

    let iterations = options.iterations;
    let cellSize = options.cellSize;

    let height = FINAL_IMAGE_SIZE / cellSize;
    let width = (FINAL_IMAGE_SIZE / 2) / cellSize;

    let GOLMatrix = game_of_life.run(height,width,options.iterations,seed);

    pngFromGOLMatrix(GOLMatrix, cellSize);
}

const pngFromGOLMatrix = (matrix, cellSize) => {

    const emptyRow = (row) => row.every(cell => JSON.stringify(cell) === JSON.stringify(DEAD));

    let topMargin = matrix.findIndex((row) => !emptyRow(row));

    let bottomMargin = matrix.slice()
                            .reverse()
                            .findIndex((row) => !emptyRow(row));

    let offset = Math.trunc((topMargin + bottomMargin) / 2 * cellSize); // centers the cells vertically

    matrix = matrix.slice(topMargin, matrix.length - bottomMargin + 1);

    let png = new PNG({
        height: FINAL_IMAGE_SIZE,
        width: FINAL_IMAGE_SIZE
    });

    console.log(offset);

    // draw background
    for (let y = 0; y < png.height; y++) {

        for (let x = 0; x < png.width; x++) {

            let writeIndex = (png.width * y + x) << 2;

            png.data[writeIndex] = DEAD.r;
            png.data[writeIndex + 1] = DEAD.g;
            png.data[writeIndex + 2] = DEAD.b;
            png.data[writeIndex + 3] = 255; // alpha

        }
    }
    let currentCellY = 0;
    let currentCellX = 0;

    for (let y = offset; y < png.height - offset; y++) {

        currentCellX = 0;
        if ((y - offset) % cellSize === 0 && (y - offset) !== 0) {
            currentCellY++;
        }
        for (let x = 0; x < png.width; x++) {
            if (x % cellSize === 0 && x !== 0) {
                currentCellX++;
            }
            let writeIndex = (png.width * y + x) << 2;
            
            png.data[writeIndex] = matrix[currentCellY][currentCellX].r;
            png.data[writeIndex + 1] = matrix[currentCellY][currentCellX].g;
            png.data[writeIndex + 2] = matrix[currentCellY][currentCellX].b;
            png.data[writeIndex + 3] = 255; // alpha

        }
    }

    let buffer = PNG.sync.write(png);
    fs.writeFileSync('out.png', buffer);
};

module.exports.createPNG = createPNG;