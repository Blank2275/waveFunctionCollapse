class TileMap {
    constructor(width, height, scale) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.initGrid();
    }

    initGrid() {
        this.grid = [];

        for (let y = 0; y < this.height; y++) {
            this.grid.push([]);

            for (let x = 0; x < this.width; x++) {
                this.grid[y].push(new TileItem(-1, x, y));
            }
        }
    }

    collapse(rules) {
        let initialValue = 0;

        this.grid[0][0].type.value = initialValue;

        let open = [this.grid[0][0]];

        let i = 0;
        while (open.length > 0 && i < 100) {
            let newOpen = [];
            i += 1;

            for (let tile of open) {
                let relevantGrid = this.findRelevantGrid(tile.x, tile.y);

                let matchingRules = [];

                for (let rule of rules) {
                    if (rule.matches(relevantGrid)) {
                        matchingRules.push(rule);
                    }
                }

                if (matchingRules.length > 0) {
                    let totalWeight = matchingRules.reduce(
                        (acc, rule) => acc + rule.weight,
                        0
                    );
                    let val = Math.random();

                    let sum = 0;
                    let chosenRule;
                    for (let rule of matchingRules) {
                        if (
                            val > sum &&
                            val <= sum + rule.weight / totalWeight
                        ) {
                            chosenRule = rule;
                            break;
                        }

                        sum += rule.weight / totalWeight;
                    }

                    this.grid[tile.y][tile.x] = new TileItem(
                        chosenRule.coreValue.value,
                        tile.x,
                        tile.y
                    );
                } else {
                    this.grid[tile.y][tile.x] = new TileItem(
                        -2,
                        tile.x,
                        tile.y
                    ); // -2 means no rules apply
                }

                for (let yOffset = -1; yOffset <= 1; yOffset++) {
                    for (let xOffset = -1; xOffset <= 1; xOffset++) {
                        let xPos = tile.x + xOffset;
                        let yPos = tile.y + yOffset;

                        if (
                            xPos < 0 ||
                            yPos < 0 ||
                            xPos >= this.width ||
                            yPos >= this.height ||
                            newOpen.filter((t) => t.x == xPos && t.y == yPos)
                                .length > 0 ||
                            open.filter((t) => t.x == xPos && t.y == yPos)
                                .length > 0 // no duplicates
                        ) {
                            continue;
                        }
                        newOpen.push(this.grid[yPos][xPos]);
                    }
                }
            }

            open = newOpen;
        }
    }

    findRelevantGrid(x, y) {
        let grid = [];

        let yIndex = 0;
        for (let yPos = y - 1; yPos <= y + 1; yPos++) {
            grid.push([]);
            for (let xPos = x - 1; xPos <= x + 1; xPos++) {
                if (
                    xPos < 0 ||
                    yPos < 0 ||
                    xPos >= this.width ||
                    yPos >= this.height
                ) {
                    grid[yIndex].push(new TileType(-1));
                    continue;
                }
                grid[yIndex].push(this.grid[yPos][xPos].type);
            }
            yIndex += 1;
        }

        return grid;
    }
}

class Rule {
    constructor(type, weight, allowed, disallowed) {
        this.coreValue = new TileType(type);
        this.weight = weight;
        this.allowed = allowed.map((val) => new TileType(val));
        this.disallowed = disallowed.map((val) => new TileType(val));
    }

    matches(grid) {
        let isAllowed = false;
        let isDisallowed = false;

        for (let type of this.allowed) {
            isAllowed =
                isAllowed ||
                grid[0][1].value == type.value ||
                grid[0][1].value == -1;
            isAllowed =
                isAllowed ||
                grid[2][1].value == type.value ||
                grid[2][1].value == -1;
            isAllowed =
                isAllowed ||
                grid[1][0].value == type.value ||
                grid[1][0].value == -1;
            isAllowed =
                isAllowed ||
                grid[1][2].value == type.value ||
                grid[1][2].value == -1;
        }

        for (let type of this.disallowed) {
            isDisallowed = isDisallowed || grid[0][1].value == type.value;
            isDisallowed = isDisallowed || grid[2][1].value == type.value;
            isDisallowed = isDisallowed || grid[1][0].value == type.value;
            isDisallowed = isDisallowed || grid[1][2].value == type.value;
        }

        return isAllowed && !isDisallowed;
    }
}

class TileItem {
    constructor(type, x, y) {
        this.type = new TileType(type);
        this.x = x;
        this.y = y;
    }

    matches(other) {
        return this.value.matches(other.value);
    }
}

class TileType {
    constructor(value) {
        this.value = value;
    }

    matches(other) {
        return (
            this.value == other.value || other.value == -1 || this.value == -1
        );
    }
}
