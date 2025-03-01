# Boid Simulation

## Overview
This project is a JavaScript-based simulation of boid flocking behavior, inspired by Craig Reynolds' "Boids" model. It demonstrates emergent flocking behavior using a set of simple rules applied to autonomous agents (boids) that move across an HTML5 canvas.

## Features
- Adjustable parameters for real-time interaction
- Boid avoidance and flocking behaviors
- Cursor tracking for user interaction
- Speed and range controls for customized movement


## Installation & Usage
1. Clone this repository:
   ```sh
   git clone https://github.com/Fatcatcreate/Boids.git
   cd src
   ```
2. Open `index.html` in a web browser.
3. Adjust the simulation parameters using the UI controls.

## Parameters
The following parameters can be adjusted dynamically:
- **Boid Count**: Number of boids in the simulation.
- **Visual Range**: The distance within which boids react to each other.
- **Protected Range**: Minimum distance boids maintain to avoid collisions.
- **Centering Factor**: Strength of the alignment to the center of the group.
- **Avoid Factor**: Strength of avoidance when boids are too close.
- **Matching Factor**: Influence of neighbors' velocity on individual boids.
- **Turn Factor**: Strength of turning to stay within bounds.
- **Min/Max Speed**: Range of speed for boid movement.
- **Cursor Bias**: Strength of attraction towards the cursor.
- **Follow Cursor**: Toggle for cursor attraction behavior.

## How It Works
Each boid follows these rules:
1. **Separation**: Avoids collisions with nearby boids.
2. **Alignment**: Matches velocity with neighboring boids.
3. **Cohesion**: Moves towards the average position of nearby boids.
4. **Boundary Avoidance**: Ensures boids stay within the canvas.
5. **Cursor Attraction** *(optional)*: Boids follow the user's mouse position.

## Code Overview
The main logic is contained in `script.js`, which:
- Initializes and updates boid positions.
- Applies flocking rules based on neighboring boids.
- Draws boids on an HTML5 canvas.
- Listens for UI inputs to update parameters in real-time.

### Key Functions
```js
function initBoids(count) {
    boids = [];
    for (let i = 0; i < count; i++) {
        boids.push(new Boid());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boids.forEach(boid => {
        boid.update();
        boid.draw();
    });
    requestAnimationFrame(animate);
}

class Boid {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
    }
    update() {
        this.applyRules();
        this.keepWithinBounds();
        this.x += this.vx;
        this.y += this.vy;
        this.limitSpeed();
    }
}
```

## Screenshots
<img width="1335" alt="Screenshot 2025-02-28 at 08 35 34" src="https://github.com/user-attachments/assets/cf24cdce-2bb0-4693-a962-f87a710fc8ef" />

<img width="1395" alt="Screenshot 2025-02-28 at 08 35 49" src="https://github.com/user-attachments/assets/8be51f9e-c392-4b10-9be5-dcff75f2cf6e" />



## Acknowledgments
- Inspired by Craig Reynolds' "Boids" simulation.
- Developed using JavaScript and HTML5 Canvas.

## Contact
submit a pull request!

