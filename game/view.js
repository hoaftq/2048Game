// 248 Game - JavaScript, Jquery 
// Write by Trac Quang Hoa, 2018

function GameView(xDim, yDim, tileSize, padding, animationSpeed) {
    var size = tileSize + padding;
    var gameBoard;
    var scoreBoard;
    var bestScoreBoard;

    /**
     * Initialize a game board in the given container
     * @param {*} container 
     * @param {*} newGameCallback 
     */
    this.init = function (container, newGameCallback) {
        var barWidth = this.width() / 3;
        var barFontSize = barWidth / 5;
        var barHeight = barFontSize * 2.5;

        var gameControl = $('<div></div>')
            .addClass('g248-game-control')
            .css('font-size', barFontSize + 'px')
            .height(barHeight);

        $('<div></div>').addClass('g248-score-board')
            .append('<div>Score</div>')
            .append(scoreBoard = $('<div>0</div>').css('margin-top', (-barFontSize / 3) + 'px'))
            .width(barWidth)
            .appendTo(gameControl);

        newGameButton = $('<div>New game</div>')
            .addClass('g248-new-game')
            .width(barWidth)
            .css('line-height', barHeight + 'px')
            .appendTo(gameControl)
            .click($.proxy(function (e) {

                // Clear the game board
                this.clear();

                // Notifies that a new game is requested
                if (newGameCallback) {
                    newGameCallback();
                }
            }, this));

        $('<div></div>').addClass('g248-score-board')
            .append('<div>Best</div>')
            .width(barWidth)
            .append(bestScoreBoard = $('<div>0</div>').css('margin-top', (-barFontSize / 3) + 'px'))
            .appendTo(gameControl);

        // Create a game-board div that will contain all the tiles
        gameBoard = $('<div></div>')
            .addClass('g248-game-board')
            .css({
                width: (size * xDim + padding) + 'px',
                height: (size * yDim + padding) + 'px'
            });

        // Create backgound tiles
        var i, j;
        for (i = 0; i < xDim; i++) {
            for (j = 0; j < yDim; j++) {
                gameBoard.append(createTile({ x: i, y: j }));
            }
        }

        $(container).append(gameControl).append(gameBoard);
    }

    /**
     * Display new score
     * @param {*} score 
     */
    this.score = function (score) {
        scoreBoard.text(score);
    }

    /**
     * Display a new best score
     * @param {*} score 
     */
    this.bestScore = function (score) {
        bestScoreBoard.text(score);
    }

    /**
     * Get width of the game board
     */
    this.width = function () {
        return size * xDim + padding;
    }

    /**
     * Clear the game board.
     * After this function the game board is reset to the initialization state
     */
    this.clear = function () {

        // Remove all tiles that is created when playing
        gameBoard.find('.g248-play-tile').remove();

        // Reset score
        this.score(0);

        // Remove ended-game popup
        $('.g248-gameover-popup').remove();
    }

    /**
     * Put a title with specified text at a specified position
     * @param {*} pos 
     * @param {*} text 
     */
    this.putAt = function (pos, value) {

        // Creates a hidden tile then shows it with fade-in animation
        createTile(pos, 'g248-play-tile ' + createPosClass(pos), value, true)
            .appendTo(gameBoard)
            .fadeIn(animationSpeed);
    }

    /**
     * Move a tile from posFrom to posTo and set a new value to it if specifed.
     * If there is another tile at posTo then this tile will be removed first.
     * 
     * @param {*} posFrom 
     * @param {*} posTo 
     * @param {*} newValue optional
     */
    this.move = function (posFrom, posTo, newValue) {
        var fromClass = createPosClass(posFrom);
        var toClass = createPosClass(posTo);

        // If source position and destination position are different
        if (posFrom.x != posTo.x || posFrom.y != posTo.y) {

            var fromTile = gameBoard.find('.' + fromClass);
            var toTile = gameBoard.find('.' + toClass);

            // There is a tile at the same position as the destinaton then removes it first with animation
            toTile.fadeOut(animationSpeed, function () {
                this.remove();
            });

            // Move the tile from posFrom to posTo with animation
            var tile = fromTile
                .animate({
                    left: (padding + posTo.x * size) + 'px',
                    top: (padding + posTo.y * size) + 'px'
                }, animationSpeed)
                .removeClass(fromClass)
                .addClass(toClass);
        } else {
            var tile = gameBoard.find('.' + toClass);
        }

        // A new value need to be applied to the destination tile
        if (newValue) {
            tile.queue(function () {
                var fontSize = getTileFontSize(newValue);
                tile.text(newValue)
                    .css('font-size', fontSize + 'px')
                    .removeClass('g248-v' + (newValue / 2))
                    .addClass('g248-v' + newValue)
                    .dequeue();
            });
        }
    }

    /**
     * Show the game-over popup
     */
    this.gameOver = function () {
        var msg = 'Game Over!';
        var fontSize = this.width() / msg.length;
        $('<div></div>')
            .text(msg)
            .addClass('g248-gameover-popup')
            .css({
                'font-size': fontSize + 'px',
                'margin-top': '-' + gameBoard.css('height'),
                width: gameBoard.css('width'),
                height: gameBoard.css('height'),
                'line-height': gameBoard.css('height'),
            })
            .insertAfter(gameBoard);
    }

    /**
     * Create a class that contains position of a tile
     * @param {*} pos 
     */
    function createPosClass(pos) {
        return pos.x + '_' + pos.y;
    }

    /**
     * Create a new tile with given properties
     * @param {*} pos 
     * @param {*} clazz optional
     * @param {*} value optional
     * @param {*} hide optional
     */
    function createTile(pos, clazz, value, hide) {
        var tile = $('<div></div>').css({
            left: (padding + pos.x * size) + 'px',
            top: (padding + pos.y * size) + 'px',
            width: tileSize + 'px',
            height: tileSize + 'px',
            'line-height': tileSize + 'px'
        });

        if (clazz) {
            tile.addClass(clazz)
        }

        if (value) {
            var fontSize = getTileFontSize(value);
            tile.text(value).addClass('g248-v' + value).css('font-size', fontSize + 'px');
        }

        if (hide) {
            tile.css('display', 'none');
        }

        return tile;
    }

    /**
     * Decide tile's font size base on the number of digits of the tile's value
     * @param {*} tileValue 
     */
    function getTileFontSize(tileValue) {
        return tileSize * 0.75 / (1 + (tileValue.toString().length - 1) * 0.2);
    }
}