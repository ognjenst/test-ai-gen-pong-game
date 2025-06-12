# Pong Game (AI-Generated)

This is a simple Pong game implemented in JavaScript and rendered on an HTML5 Canvas. The game features a player paddle (left), an AI-controlled paddle (right), and a ball that bounces between them. The AI paddle tracks the ball's position to provide a challenging opponent.

## Features

- **Player Paddle:** Controlled using the mouse; move your mouse up and down to control the left paddle.
- **AI Paddle:** The right paddle is controlled by a basic AI that follows the ball.
- **Ball Dynamics:** The ball bounces off the paddles and canvas edges.
- **Score Keeping:** Scores are displayed at the top of the screen for both the player and AI.
- **Start Button:** The game starts only when you click the "Start Game" button.
- **Progressive Difficulty:** The ball automatically speeds up every 10 seconds during play, making the game more challenging over time.
- **Clean UI:** Simple canvas graphics for an authentic retro Pong feel.

## How to Play

1. Open the game in any modern web browser.
2. Click the **Start Game** button above the canvas to begin.
3. Move your mouse up or down over the canvas to control the player paddle.
4. Try to keep the ball in play and score against the AI.
5. The ball will get faster every 10 seconds, so stay alert!

## Technical Details

- The game logic and rendering are contained in `game.js`.
- The game uses an event listener for mouse movement to update the player's paddle position.
- The AI paddle uses a simple algorithm to follow the vertical position of the ball.
- The ball's speed increases at 10-second intervals, reset after each point.

## Acknowledgement

> **This Pong game implementation and this README file were AI-generated using GitHub Copilot.**  
> You are encouraged to review, modify, and expand the game as you wish!

---

Enjoy the game!