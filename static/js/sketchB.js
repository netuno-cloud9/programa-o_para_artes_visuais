let colors = [];
let numLines = 10; // Number of flow lines
let stepSize = 20; // Distance between control points
let segments = 30; // Number of segments in each line

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(3);

  // Define colors for the lines
  colors = [
    color(173, 216, 230), // Light Blue
    color(144, 238, 144), // Light Green
    color(255, 182, 193), // Light Pink
    color(221, 160, 221), // Light Purple
  ];
}

function draw() {
  background(20); // Dark background

  // Generate flowing lines
  for (let i = 0; i < numLines; i++) {
    let yOffset = map(i, 0, numLines, height * 0.2, height * 0.8); // Vertical spacing
    stroke(colors[i % colors.length]); // Cycle through colors

    beginShape();
    for (let j = 0; j < segments; j++) {
      let x = map(j, 0, segments - 1, 0, width); // Horizontal spread
      let y = yOffset + sin((frameCount + j * stepSize) * 0.05) * 50; // Dynamic curve
      curveVertex(x, y);
    }
    endShape();
  }
}
