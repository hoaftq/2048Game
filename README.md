### 248Game
Well-known 248 game written using JavaScript &amp; JQuery. Difference from other implementations it supports many board sizes 4x4, 5x5, 6x6, 7x7 and 8x8. It is also responsive and supports mobile devices as well as computers.

It is using MVC pattern where the program is devided into 3 parts with coressponding files controller.js, logic.js and view.js
  - **Controller** (controller.js)
      - Entry point for user interation
      - Coordinate logic and view
      - ect

  - **Logic** (logic.js)  
    Manage a game board array behind the scene
      - Put new titles
      - Calculate game board after a move
      - Determine when the game is over
      - ect

  - **View** (view.js)
      - Render game board, scores, game status
      - Display new titles, move titles with animation
      - ect

This is a 7x7 game board screenshot
<img src="248Game.jpg">
