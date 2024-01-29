# Multiplayer-Chess

A dynamic and interactive Multiplayer Chess game built with React, SASS, Node.js, and Socket.IO. This application offers a real-time chess experience with an integrated chat feature, allowing players to communicate with each other during the game.

## Key Features

- **Real-Time Multiplayer Gameplay**: Utilizes web sockets with Socket.IO for seamless multiplayer functionality.
- **In-Game Chat**: Chat in real time with your opponent directly within the game interface.
- **Responsive Design**: Adapts smoothly to different screen sizes for optimal gameplay on any device.
- **Disconnect Handling**: Displays a modal notification if your opponent disconnects from the game.
- **Chess Rule Enforcement**: Supports only legal chess moves, including special moves like castling and pawn promotion.
- **Move Visualization**: Available moves are highlighted on the chessboard for easy decision-making.
- **Move History**: Keep track of all the moves made during the game for strategic analysis.
- **Local Play Option**: Play chess locally by yourself or with a friend in person.
- **Dynamic Board Rotation**: The chessboard rotates based on the player's turn for a more intuitive experience.

## Getting Started - Local use/development

- You need to clone both this and the backend **multiplayer-chess-backend** repository
- `npm i`
- Create a .env file and set the variable `REACT_APP_BASE_URL ={URL_OF_THE_BACKEND}` default should be http://localhost:4000/
- `npm start`

---
Developed by Aleksandar Stoyanov
