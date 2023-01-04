// 248 Game - JavaScript, Jquery 
// Write by Trac Quang Hoa, 2018

function GameLogic(xSize, ySize) {

    var appearingOptions = {
        4: {
            frequency: {
                2: [0, 0.75],
                4: [0.75, 1]
            },
            initQuantity: 2,
            quantity: 1
        },
        5: {
            frequency: {
                2: [0, 0.5],
                4: [0.5, 1]
            },
            initQuantity: 3,
            quantity: 2
        },
        6: {
            frequency: {
                2: [0, 0.4],
                4: [0.4, 0.8],
                8: [0.8, 1]
            },
            initQuantity: 4,
            quantity: 3
        },
        7: {
            frequency: {
                2: [0, 0.33],
                4: [0.33, 0.66],
                8: [0.66, 1]
            },
            initQuantity: 4,
            quantity: 3
        },
        8: {
            frequency: {
                2: [0, 0.25],
                4: [0.25, 0.5],
                8: [0.5, 0.75],
                16: [0.75, 1]
            },
            initQuantity: 5,
            quantity: 4
        }
    };

    var board = [];
    var countEmptyTile = xSize * ySize;
    var score = 0;

    /**
     * Initalize an empty game board
     */
    this.initGameBoard = function () {
        var i, j, row;
        for (i = 0; i < xSize; i++) {
            row = [];
            for (j = 0; j < ySize; j++) {

                // a value of 0 means no title here at (i, j)
                row.push(0);
            }

            board.push(row);
        }
    }

    /**
     * Clear the game board
     */
    this.clearGameBoard = function () {
        var i, j;
        for (i = 0; i < xSize; i++) {
            for (j = 0; j < ySize; j++) {
                board[i][j] = 0;
            }
        }

        countEmptyTile = xSize * ySize;
        score = 0;
    }

    /**
     * Init the first tiles on the board using appearing options
     * @param {*} callback 
     */
    this.putInitTile = function (callback) {
        var k = appearingOptions[xSize].initQuantity;
        for (; k > 0; k--) {
            putARandomTitle(callback);
        }
    }

    /**
     * Put random tiles using apprearing options
     * @param {*} callback 
     */
    this.putRandomTile = function (callback) {
        var k = appearingOptions[xSize].quantity;
        for (; k > 0; k--) {
            putARandomTitle(callback);
        }
    }

    /**
     * Put a random tile to the board
     * @param {*} callback 
     */
    function putARandomTitle(callback) {
        var i, j, position = Math.floor(Math.random() * countEmptyTile);
        for (i = 0; i < xSize; i++) {
            for (j = 0; j < ySize; j++) {
                if (board[i][j] == 0 && position-- == 0) {
                    board[i][j] = randomValue();
                    countEmptyTile--;
                    return callback({ x: i, y: j }, board[i][j]);
                }
            }
        }
    }

    /**
     * Check if the game is over.
     * This is when it can not be putted a new tile to the board
     */
    this.isGameOver = function () {
        var i, j;
        for (i = 0; i < xSize; i++) {
            for (j = 0; j < ySize; j++) {

                // There is still empty tile
                if (board[i][j] == 0) {
                    return false;
                }

                // 2 tiles in a row that can be merged together
                if (j + 1 < ySize && board[i][j] == board[i][j + 1]) {
                    return false;
                }

                // 2 tiles in a column that can be merged together
                if (i + 1 < xSize && board[i][j] == board[i + 1][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Move tiles to given direction
     * @param {*} direct 
     * @param {*} callback 
     * @param {*} scoreCallback 
     */
    this.move = function (direct, callback, scoreCallback) {
        switch (direct) {
            case 'up':
                moveUp(callback, scoreCallback);
                break;
            case 'down':
                moveDown(callback, scoreCallback);
                break;
            case 'left':
                moveLeft(callback, scoreCallback);
                break;
            case 'right':
                moveRight(callback, scoreCallback);
                break;
        }
    }

    function moveUp(callback, scoreCallback) {

        // Go though all columns
        var i;
        for (i = 0; i < xSize; i++) {

            // Point to the position where a tile can move to or merge with
            // Initialize it with the first row
            var p = 0,
                j = p + 1;
            while (j < ySize) {

                // There is a tile at (i, j) that needs to process (move, merge or nothing)
                if (board[i][j] != 0) {

                    // No tile at (i, p)
                    if (board[i][p] == 0) {

                        // Just move (i, j) to (i, p)}
                        move({ x: i, y: j }, { x: i, y: p }, callback);

                        // (i, j) has been processed, continue with the next tile
                        j++;
                    } else {

                        // (i, p) and (i, j) can be merged
                        if (board[i][p] == board[i][j]) {

                            // Merge (i, j) with (i, p)
                            merge({ x: i, y: j }, { x: i, y: p }, callback, scoreCallback);

                            // (i, j) has been processed, continue with the next tile
                            j++;

                            // (i, p) has been merged, so p points to the next tile
                            p++;
                        } else {

                            // (i, p) cannot be merged, so p points to the next tile
                            p++;

                            // (i, j) cannot be moved or merged, continue with the next tile 
                            if (p == j) {
                                j++;
                            }
                        }
                    }
                } else {

                    // No title that needs to process at (i, j) then ignore this position and continue with the next position
                    j++;
                }
            }
        }
    }

    function moveDown(callback, scoreCallback) {

        // Go though all columns
        var i;
        for (i = 0; i < xSize; i++) {

            // Point to the position where a tile can move to or merge with
            // Initialize it with the last row
            var p = ySize - 1,
                j = p - 1;
            while (j >= 0) {

                // There is a tile at (i, j)
                if (board[i][j] != 0) {

                    // No tile at (i, p)
                    if (board[i][p] == 0) {

                        // Just move (i, j) to (i, p)}
                        move({ x: i, y: j }, { x: i, y: p }, callback);
                        j--;
                    } else {

                        // (i, p) and (i, j) can be merged
                        if (board[i][p] == board[i][j]) {

                            // Merge (i, j) with (i, p)
                            merge({ x: i, y: j }, { x: i, y: p }, callback, scoreCallback);
                            j--;

                            p--
                        } else {
                            p--;
                            if (p == j) {
                                j--;
                            }
                        }
                    }
                } else {
                    j--;
                }
            }
        }
    }

    function moveLeft(callback, scoreCallback) {

        // Go though all rows
        var j;
        for (j = 0; j < ySize; j++) {

            // Processing pointer
            var p = 0, i = p + 1;
            while (i < xSize) {
                if (board[i][j] != 0) {

                    // No tile at (p, j)
                    if (board[p][j] == 0) {

                        // Just move (i, j) to (p, j)}
                        move({ x: i, y: j }, { x: p, y: j }, callback);
                        i++;
                    } else {

                        // (p, j) and (i, j) can be merged
                        if (board[p][j] == board[i][j]) {

                            // Merge (i, j) with (i, p)
                            merge({ x: i, y: j }, { x: p, y: j }, callback, scoreCallback);
                            i++;

                            p++;
                        } else {
                            p++;
                            if (p == i) {
                                i++;
                            }
                        }
                    }
                } else {
                    i++;
                }
            }
        }
    }

    function moveRight(callback, scoreCallback) {

        // Go though all rows
        var j;
        for (j = 0; j < ySize; j++) {

            // Processing pointer
            var p = xSize - 1,
                i = p - 1;
            while (i >= 0) {
                if (board[i][j] != 0) {

                    // No tile at (p, j)
                    if (board[p][j] == 0) {

                        // Just move (i, j) to (p, j)}
                        move({ x: i, y: j }, { x: p, y: j }, callback);
                        i--;
                    } else {

                        // (p, j) and (i, j) can be merged
                        if (board[p][j] == board[i][j]) {

                            // Merge (i, j) with (p, j)
                            merge({ x: i, y: j }, { x: p, y: j }, callback, scoreCallback);
                            i--;
                            p--;
                        } else {
                            p--;
                            if (p == i) {
                                i--;
                            }
                        }
                    }
                } else {
                    i--;
                }
            }
        }
    }

    /**
     * Move the tile at {from} to {to}
     * @param {*} from 
     * @param {*} to 
     * @param {*} callback 
     */
    function move(from, to, callback) {
        board[to.x][to.y] = board[from.x][from.y];
        board[from.x][from.y] = 0;
        if (callback) {
            callback(from, to);
        }
    }

    /**
     * Merge the tile at {from} with the tile at {to}
     * @param {*} from 
     * @param {*} to 
     * @param {*} callback 
     * @param {*} scoreCallback 
     */
    function merge(from, to, callback, scoreCallback) {
        board[to.x][to.y] += board[from.x][from.y];
        board[from.x][from.y] = 0;
        if (callback) {
            callback(from, to, board[to.x][to.y]);
        }

        if (scoreCallback) {
            scoreCallback(score += board[to.x][to.y], board[to.x][to.y]);
        }

        // A merge leaves a position empty 
        countEmptyTile++;
    }

    /**
     * Get a random value using appearing options
     */
    function randomValue() {
        var freq = appearingOptions[xSize].frequency, v,
            randNumber = Math.random();
        for (v in freq) {
            var chances = freq[v];
            if (chances[0] <= randNumber && randNumber < chances[1]) {
                return parseInt(v);
            }
        }
    }
}