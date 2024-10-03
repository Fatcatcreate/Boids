const canvas = document.getElementById("boidsCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth*0.8;
canvas.height = window.innerHeight*0.8;
let boids = [];
let boidCount = 100;
let visualRange = 100;
let protectedRange = 20;
let centeringFactor = 0.005;
let avoidFactor = 0.05;
let matchingFactor = 0.05;
let turnFactor = 1;
let minSpeed = 2;
let maxSpeed = 4;
let maxBias = 0.5;
let biasIncrement = 0.01;
let cursorX = canvas.width / 2;
let cursorY = canvas.height / 2;
let followCursor = false;
let cursorBias = 0.1;
function initBoids(count) {
    boids = [];
    for (let i = 0; i < count; i++) {
        boids.push(new Boid());
    }
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
    applyBias() {
        const maxbias = 0.01;
        const bias_increment = 0.0001;
        if (this.group === 1) {
            if (this.vx > 0) {
                this.biasval = Math.min(maxbias, this.biasval + bias_increment);
            } else {
                this.biasval = Math.max(bias_increment, this.biasval - bias_increment);
            }
            this.vx = (1 - this.biasval) * this.vx + this.biasval * 1; 
        } else if (this.group === 2) { 
            if (this.vx < 0) {
                this.biasval = Math.min(maxbias, this.biasval + bias_increment);
            } else {
                this.biasval = Math.max(bias_increment, this.biasval - bias_increment);
            }
            this.vx = (1 - this.biasval) * this.vx + this.biasval * (-1);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.moveTo(this.x+2.5*Math.sqrt(3),this.y-2.5);
        ctx.lineTo(this.x,this.y+2.5);
        ctx.lineTo(this.x-2.5*Math.sqrt(3),this.y-2.5);
        ctx.closePath();
        ctx.fill();
    }
    keepWithinBounds() {
        if (this.x < 0) this.vx += turnFactor;
        if (this.x > canvas.width) this.vx -= turnFactor;
        if (this.y < 0) this.vy += turnFactor;
        if (this.y > canvas.height) this.vy -= turnFactor;
    }
    applyRules() {
        let closeDx = 0, closeDy = 0;
        let xposAvg = 0, yposAvg = 0, xvelAvg = 0, yvelAvg = 0;
        let neighboringBoids = 0;
        boids.forEach(otherBoid => {
            if (otherBoid !== this) {
                let dx = this.x - otherBoid.x;
                let dy = this.y - otherBoid.y;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared < visualRange * visualRange) {
                    if (distanceSquared < protectedRange * protectedRange) {
                        closeDx += this.x - otherBoid.x;
                        closeDy += this.y - otherBoid.y;
                    } else {
                        xposAvg += otherBoid.x;
                        yposAvg += otherBoid.y;
                        xvelAvg += otherBoid.vx;
                        yvelAvg += otherBoid.vy;
                        neighboringBoids++;
                    }
                }
            }
        });
        if (followCursor) { 
            const dx = cursorX - this.x;
            const dy = cursorY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < visualRange) {
                this.vx += (dx / distance) * cursorBias;
                this.vy += (dy / distance) * cursorBias;
            }
        }
        if (neighboringBoids > 0) {
            xposAvg /= neighboringBoids;
            yposAvg /= neighboringBoids;
            xvelAvg /= neighboringBoids;
            yvelAvg /= neighboringBoids;
            this.vx += (xposAvg - this.x) * centeringFactor;
            this.vy += (yposAvg - this.y) * centeringFactor;
            this.vx += (xvelAvg - this.vx) * matchingFactor;
            this.vy += (yvelAvg - this.vy) * matchingFactor;
        }
        this.vx += closeDx * avoidFactor;
        this.vy += closeDy * avoidFactor;
    }
    
    limitSpeed() {
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < minSpeed) {
            this.vx = (this.vx / speed) * minSpeed;
            this.vy = (this.vy / speed) * minSpeed;
        }
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
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
document.getElementById("boidCount").addEventListener("input", function () {
    document.getElementById("boidCountValue").innerText = this.value;
    boidCount = parseInt(this.value);
});
document.getElementById("visualRange").addEventListener("input", function () {
    document.getElementById("visualRangeValue").innerText = this.value;
    visualRange = parseInt(this.value);
});
document.getElementById("protectedRange").addEventListener("input", function () {
    document.getElementById("protectedRangeValue").innerText = this.value;
    protectedRange = parseInt(this.value);
});
document.getElementById("centeringFactor").addEventListener("input", function () {
    document.getElementById("centeringFactorValue").innerText = this.value;
    centeringFactor = parseFloat(this.value);
});
document.getElementById("avoidFactor").addEventListener("input", function () {
    document.getElementById("avoidFactorValue").innerText = this.value;
    avoidFactor = parseFloat(this.value);
});
document.getElementById("matchingFactor").addEventListener("input", function () {
    document.getElementById("matchingFactorValue").innerText = this.value;
    matchingFactor = parseFloat(this.value);
});
document.getElementById("turnFactor").addEventListener("input", function () {
    document.getElementById("turnFactorValue").innerText = this.value;
    turnFactor = parseFloat(this.value);
});
document.getElementById("minSpeed").addEventListener("input", function () {
    document.getElementById("minSpeedValue").innerText = this.value;
    minSpeed = parseFloat(this.value);
});
document.getElementById("maxSpeed").addEventListener("input", function () {
    document.getElementById("maxSpeedValue").innerText = this.value;
    maxSpeed = parseFloat(this.value);
});
document.getElementById("biasSlider").addEventListener("input", function () {
    document.getElementById("biasValue").innerText = this.value;
    maxBias = parseFloat(this.value);
});
document.getElementById("startButton").addEventListener("click", () => {
    initBoids(boidCount);
    animate();
});

document.getElementById("dropdownButton").addEventListener("click", () => {
    const dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});

document.getElementById("followCursorToggle").addEventListener("change", function () {
    followCursor = this.checked;
});

document.getElementById("cursorBias").addEventListener("input", function () {
    document.getElementById("cursorBiasValue").innerText = this.value;
    cursorBias = parseFloat(this.value);
});

canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    cursorX = event.clientX - rect.left;
    cursorY = event.clientY - rect.top;
});

initBoids(100);
animate();
