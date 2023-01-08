### 2048Game
Responsive 2048 game written using JavaScript &amp; JQuery. One difference from other implementations is that it supports many board sizes 4x4, 5x5, 6x6, 7x7 and 8x8.  
It follows MVC pattern where the program is divided into 3 parts with coressponding files controller.js, logic.js and view.js
  - **Controller** (controller.js)
      - Entry point for user interation
      - Coordinate logic and view
      - ect

  - **Logic** (logic.js)  
    Manage a game board array behind the scene
      - Put new titles
      - Calculate game board after a move
      - Determine if the game is over
      - ect

  - **View** (view.js)
      - Render game board, scores, game status
      - Display new titles, move titles with animation
      - ect

There is also a pipeline with Jenkins and Terraform to create and deploy the game to AWS CloudFront.  
Give the game a try [here](https://d25teof8rvvecp.cloudfront.net)