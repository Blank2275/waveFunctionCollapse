let size = 50;
let scale = 600 / size;
let tileMap = new TileMap(size, size, scale);

let rules = [
    new Rule(0, 2, [1], [2, 3]),
    new Rule(0, 3, [0], [2, 3]),
    new Rule(1, 0.01, [2], [3]),
    new Rule(1, 0.02, [0], [3]),
    new Rule(1, 1, [1], [3]),
    new Rule(2, 1, [3], [0]),
    new Rule(2, 0.5, [1], [0]),
    new Rule(2, 3, [2], [0]),
    new Rule(3, 0.15, [2], [0, 1]),
    new Rule(3, 2.5, [3], [0, 1]),
];

tileMap.collapse(rules);

colors = [
    [30, 80, 210], // water
    [200, 160, 70], // sand
    [40, 230, 60], // grass
    [35, 190, 50], // trees
];

function setup() {
    createCanvas(600, 600);
    noStroke();
}

function draw() {
    if (typeof tileMap == null) return;

    for (let y = 0; y < tileMap.grid.length; y++) {
        for (let x = 0; x < tileMap.grid[0].length; x++) {
            let value = tileMap.grid[y][x].type.value;

            let color = value >= 0 ? colors[value] : [0, 0, 0];
            fill(...color);

            rect(x * scale, y * scale, scale, scale);
        }
    }
}
