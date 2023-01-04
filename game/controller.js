// 248 Game - JavaScript, Jquery 
// Write by Trac Quang Hoa, 2018

function GameController(container, xSize, ySize) {

    // Size ratio between the tile and its padding
    var PADDING_RATIO = 10;

    var direct = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };

    var that = this;

    var tileSize;
    var padding;

    var logic;
    var view;

    var $container = $(container);
    this.bestScore = getBestScore();

    calTileSizeAndPadding();

    this.start = function () {
        logic = new GameLogic(xSize, ySize);
        view = new GameView(xSize, ySize, tileSize, padding, 100);

        logic.initGameBoard();
        view.init($container, function () {

            // Create a new game when clicking new game button
            newGame();
        });

        // This will make the game board centered in the page
        $container.width(view.width());

        $container.off('swipeleft').on('swipeleft', function (e) {
            move('left');
        }).off('swiperight').on('swiperight', function (e) {
            move('right');
        }).off('swipeup').on('swipeup', function (e) {
            move('up');
        }).off('swipedown').on('swipedown', function (e) {
            move('down');
        });

        // Register key handler for the game
        $(document).off('keydown').keydown(function (e) {

            // If the key is not one of the arrows then ignore it
            if (!direct[e.key]) {
                return;
            }

            // Move tiles according to the direction
            move(direct[e.key]);

            e.preventDefault();
        });

        // Create a new game for a first time
        newGame();
    }

    this.destroy = function () {
        $container.empty();
    }

    /**
     * Move tiles with given direct
     * @param {*} direct 
     */
    function move(direct) {

        logic.move(direct,

            // Render movement on view
            function (from, to, newValue) {
                view.move(from, to, newValue);
            },

            // Render new score
            function (score, addedScore) {
                view.score(score);
                if (score > that.bestScore) {
                    // Save a new best score
                    that.bestScore = score;

                    // Display the best score
                    view.bestScore(that.bestScore);

                    saveBestScore();
                }
            });

        // Put a new random tile
        setTimeout(function () {
            logic.putRandomTile(function (pos, text) {
                view.putAt(pos, text);
                if (logic.isGameOver()) {
                    view.gameOver();
                }
            });
        }, 150);
    }

    function newGame() {
        logic.clearGameBoard();
        view.clear();
        view.bestScore(that.bestScore);

        logic.putInitTile(function (pos, text) {
            view.putAt(pos, text);
        });
    }

    /**
     * Calculate title size and padding according to page size
     */
    function calTileSizeAndPadding() {
        var maxSize = Math.min($(document).width(), $(document).height() * 0.7);
        var size = maxSize - 3 * maxSize / xSize / PADDING_RATIO;
        padding = size / xSize / PADDING_RATIO;
        tileSize = (PADDING_RATIO - 1) * padding;
    }

    /**
     * Get best score of current game mode stored in cookie
     */
    function getBestScore() {
        var best = $.cookie.get('best' + xSize);
        if (best === null) {
            return 0;
        } else {
            return parseInt(best);
        }
    }

    /**
     * Save best score to cookie
     */
    function saveBestScore() {

        // Expires in 1 year
        $.cookie.add('best' + xSize, that.bestScore, 12 * 30 * 24 * 3600, '/');
    }
}