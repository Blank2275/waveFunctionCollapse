let mat = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
];

function rotateMat(mat) {
    let res = [];

    for (let y = 0; y < mat.length; y++) {
        res.push([]);
        for (let x = 0; x < mat[y].length; x++) {
            res[y].push(0);
        }
    }

    for (let y = 0; y < mat.length; y++) {
        for (let x = 0; x < mat[0].length; x++) {
            res[mat[0].length - x - 1][y] = mat[y][x];
        }
    }

    return res;
}

for (let i = 0; i < 4; i++) {
    console.log(mat);

    mat = rotateMat(mat);
}
