
const crypto = require('crypto');
//use sha256 algorithm 
const hash = crypto.createHash('sha256');
//set threshold value for alive or dead
let THRESHOLD = 5;

let ALIVE;

const DEAD = {
  r: 239,
  g: 239,
  b: 239
};

const neighbors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];

//B3/S23 => Dead cell can alive if 3 neighbor cells are alive and Alive cell can only 
//survive if 2/3 neighbor cells are alive
const RULES = [
    [3], // Born  
    [0, 1, 2, 3, 4, 5, 6, 7, 8] // Survive
];

const hashed = (seed,length) => hash.update(seed).digest("hex").slice(0,length).split('');

const isAliveOrDead = (hashed) => hashed.map( hex_char => parseInt(`0x${hex_char}`) <= THRESHOLD ? ALIVE : DEAD);

const toMatrix = (arr, width) => arr.reduce((rows, val, index) => (index % width === 0 ? rows.push([val]) : rows[rows.length - 1].push(val)) && rows, []);
    
const evolve = (states, rules) => states.map((row, rowIndex) => row.map((cell, colIndex) => evolveCell(states, rules, cell, rowIndex, colIndex)));

const evolveCell = (states, rules, cell, rowIndex, colIndex) => {
    
    let numAliveNeighbors = getAliveNeighbors(states, rowIndex, colIndex);

    if (cell === DEAD && rules[0].indexOf(numAliveNeighbors) > -1) {
    // born
    return ALIVE;
    }

    if (cell === ALIVE && rules[1].indexOf(numAliveNeighbors) > -1) {
    // survive
    return ALIVE;
    }

    return DEAD;

};

const getAliveNeighbors = (states, row, col) => {

    return neighbors.reduce((count, neighbor) => {
    if (
        states[row + neighbor[0]] &&
        states[row + neighbor[0]][col + neighbor[1]] === ALIVE
    ) {
        return count += 1;
    }
    return count;
    }, 0);

};

const runAutonoma = (states, iterationsLeft, rules) => {
    
    if (iterationsLeft <= 0) {
        return states;
    }

    let nextStates = evolve(states, rules);

    return runAutonoma(nextStates, iterationsLeft - 1, rules)
};

const aliveThreshold = (hashAry) => parseInt(`0x${hashAry[0]}`) / 16;

const run = (height, width, iterations, seed) => {
    
    let numCells = height * width;

    let hashArray = hashed(seed, numCells);

    ALIVE = require('./colorGenerator')(aliveThreshold(hashArray));

    let statesArray = isAliveOrDead(hashArray, width);

    let states = toMatrix(statesArray,width);

    let finalStates = runAutonoma(states, iterations, RULES);

    return finalStates.map((row) => {
        // mirror along vertical axis
        return row.concat(row.slice().reverse());
    });
}

module.exports = { run, DEAD } ;