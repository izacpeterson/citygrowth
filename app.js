let width = window.innerWidth;
let height = window.innerHeight;
function setup() {
  createCanvas(width, height);
}

let points = [];
let filled = [];

class Point {
  constructor(x, y, filled, direction) {
    this.x = x;
    this.y = y;
    this.filled = filled;
    this.direction = direction;
    this.age = 0;
    this.speed = Math.random() + 1;
    this.wiggleStrength = 0;

    let rando = Math.random();
    if (Math.random() > 0.75) {
      this.wiggleStrength = Math.random() * 5;
    }
  }

  draw() {
    // stroke(this.age);
    stroke(color(255, 220, 200));
    strokeWeight(1.5);
    if (this.filled) point(this.x, this.y);
  }

  update() {
    this.age += 0;
    if (this.age > 255) this.remove = true;
    const speed = this.speed; // Define the speed at which the point moves

    // Calculate the new coordinates based on the current direction
    const deltaX = speed * Math.cos(this.direction);
    const deltaY = speed * Math.sin(this.direction);

    // Calculate the potential new coordinates
    const newX = this.x + deltaX;
    const newY = this.y + deltaY;

    let isFilled = false;

    // Check if the pixel at the potential new coordinates is filled
    let pix = get(newX, newY);
    // console.log(pix);
    if (pix[3] > 20) {
      isFilled = true;
    }
    // for (let i = 0; i < filled.length; i++) {
    //   const point = filled[i];
    //   if (Math.abs(point.x - newX) <= 0.5 && Math.abs(point.y - newY) <= 0.5) {
    //     isFilled = true;
    //     break;
    //   }
    // }

    if (isFilled) {
      // If the pixel is filled, mark this point for removal
      this.remove = true;
    } else {
      // Update the x and y coordinates
      this.x = newX;
      this.y = newY;

      // Add some random angle variation (wiggle) to the current direction
      let distance = calculateDistance(width / 2, height / 2, this.x, this.y);
      let strength = (distance / height) * this.wiggleStrength;
      const wiggle = Math.random() * strength - strength / 2; // Adjust the range of wiggle as desired
      this.direction += wiggle;
    }

    if (this.x > width || this.y > height || this.x < 0 || this.y < 0) {
      // Mark this point for removal if it's out of bounds
      this.remove = true;
    }
  }
}

function calculateDistance(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return distance;
}

// Example usage
const x1 = 0;
const y1 = 0;
const x2 = 3;
const y2 = 4;

const distance = calculateDistance(x1, y1, x2, y2);
console.log(distance); // Output: 5

// initializePoints();

points.push(new Point(width / 2, height / 2, true, 0));

function initializePoints() {
  for (let i = 0; i < 2; i++) {
    points.push(
      new Point(
        Math.floor(Math.random() * width),
        Math.floor(Math.random() * height),
        true,
        Math.random() * 2 * Math.PI
      )
    );
  }
}
let gens = 0;
function draw() {
  gens++;
  if (gens > 1000) return;
  for (let i = 0; i < 1; i++) {
    let pointsToRemove = [];

    points.forEach((point) => {
      point.draw();
      point.update();
      filled.push({ x: point.x, y: point.y, dir: point.direction });

      if (point.remove) {
        points.splice(points.indexOf(point), 1);
      }
    });

    for (let i = 0; i < 10; i++) {
      let rpoint = Math.floor(Math.random() * filled.length);
      let rando = Math.floor(Math.random() * 100);
      let directionOffset = rando > 50 ? 1.5708 : -1.5708;
      let distance = calculateDistance(
        width / 2,
        height / 2,
        filled[rpoint].x,
        filled[rpoint].y
      );
      let odds = Math.random() - distance / height;
      if (odds > 0.5) {
        points.push(
          new Point(
            filled[rpoint].x,
            filled[rpoint].y,
            true,
            filled[rpoint].dir + directionOffset
          )
        );
      }
    }
  }
}
