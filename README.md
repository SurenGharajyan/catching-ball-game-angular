# Angular Mini-Game: Catch Falling Objects

This is a simple mini-game built using Angular where the player controls a rectangle (player) to catch falling objects (balls). Points are awarded for each object caught, and the game ends after a set amount of time. The game settings can be configured using a form, and real-time updates are simulated using RxJS.
### This technology is a replacement for the vanilla canvas or related library and framework (like Pixi.js or Phaser) usage.

#### Code covered by unit test.

## Features
- **Game Settings Form**: Allows configuration of falling speed, falling frequency, player speed, and game duration.
- **Player Control**: Move the player left and right using arrow keys.
- **Object Spawning**: Objects fall at the specified speed and frequency [can be controlled].
- **Collision Detection**: Detect when the player catches an object and award points.
- **Game Timer**: Countdown timer for the game duration [can be controlled].
- **Score Counter**: Display the total number of caught objects.
- **Pseudo-WebSocket**: Simulate real-time game state updates using RxJS [implemented as Subject requesting].

## Requirements
- **Angular** (version 15)
- **RxJS** (for handling game state and updates)

## Installation
To run the application, follow these steps:
1. Open the terminal on the project path.

2. Install the dependencies by running terminal command:
    ```bash
    npm install
    ```

3. After dependencies installed run the command:
    ```bash
    ng serve
    ```

4. Open your browser and go to `http://localhost:4200` to play the game.

## Configuration
The game can be configured through the settings form, which includes the following fields:
- **Falling Speed**: Controls how fast the objects fall.
- **Falling Frequency**: Defines how often new objects appear.
- **Player Speed**: Controls the speed at which the player moves left and right.
- **Game Time**: Specifies the duration of the game (in milliseconds).

When time ends up, the game will show ending view which will ask for restart the game (otherwise each changes on Game Time value will trigger that). The game settings will apply immediately without reloading, and changing the game time will restart the game.

## Game Logic
- **Player Movement**: The player can move left and right using the arrow keys.
- **Object Spawning**: Objects fall at intervals specified in the settings.
- **Collision Detection**: The player catches an object if the object collides with the player's position.
- **Game Timer**: The game runs for the duration specified in the form. Once the timer runs out, the game ends.
- **Score**: Points are awarded when the player catches an object. The score is displayed on the screen.

---

**Note**: This game does not use HTML Canvas, instead it uses Angular components and RxJS for real-time updates and game logic.
I implemented in two main components without using any module only app.module.ts exists.
---
- **config-form component** - component has the editor fields which will change the configurations of game.
- **game-play-modal component** - component is actual game content which getting from the gameService required configuration to proceed with game.
- **websocket service** - is a service which imitating the websocket working (in the console it is sending the the data by interval)
- **mechanic service** - is a service which include gameplay mechanics.
- **game service** - is a service which include the data manipulation information
