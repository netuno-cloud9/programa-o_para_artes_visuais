let num = 2000; // Número de partículas
let noiseScale = 500, noiseStrength = 1;
let scale = 20; // Escala do campo de fluxo
let zoff = 0; // Offset para o ruído em z
let flowfield; // Array que armazena os vetores do campo de fluxo
let particles = [];
let backgroundColor = [0, 10]; // Cor de fundo inicial (RGBA)
let strokeWeightValue = 1; // Stroke inicial das partículas
let colorModeType = "Rainbow"; // Padrão de cor inicial

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  flowfield = new Array(floor(width / scale) * floor(height / scale));
  
  // Inicializar partículas
  for (let i = 0; i < num; i++) {
    let loc = createVector(random(width * 1.2), random(height), 2);
    let dir = createVector(cos(0), sin(0));
    let speed = random(0.5, 2);
    particles.push(new Particle(loc, dir, speed));
  }

  // Controles para personalização
  createP("Número de Partículas").position(10, height + 10);
  let particleSlider = createSlider(100, 5000, num, 100).position(10, height + 40);
  particleSlider.input(() => adjustParticles(particleSlider.value()));

  createP("Intensidade do Ruído").position(10, height + 70);
  let noiseSlider = createSlider(0.1, 5, noiseStrength, 0.1).position(10, height + 100);
  noiseSlider.input(() => noiseStrength = noiseSlider.value());

  createP("Escala do Campo de Fluxo").position(10, height + 130);
  let scaleSlider = createSlider(10, 50, scale, 5).position(10, height + 160);
  scaleSlider.input(() => scale = scaleSlider.value());

  createP("Peso do Stroke das Partículas").position(10, height + 190);
  let strokeSlider = createSlider(1, 5, strokeWeightValue, 0.5).position(10, height + 220);
  strokeSlider.input(() => strokeWeightValue = strokeSlider.value());

  createP("Cor de Fundo").position(10, height + 250);
  let bgColorPicker = createColorPicker('#000000').position(10, height + 280);
  bgColorPicker.input(() => backgroundColor = bgColorPicker.color().levels.concat([10])); // RGBA

  createP("Padrão de Cor das Partículas").position(10, height + 310);
  let colorSelect = createSelect().position(10, height + 340);
  colorSelect.option("Rainbow");
  colorSelect.option("Monochrome");
  colorSelect.option("Custom");
  colorSelect.changed(() => colorModeType = colorSelect.value());
}

function draw() {
  // Fundo com efeito de fade
  fill(...backgroundColor);
  noStroke();
  rect(0, 0, width, height);

  // Atualizar Flow Field
  let yoff = 0;
  for (let y = 0; y < floor(height / scale); y++) {
    let xoff = 0;
    for (let x = 0; x < floor(width / scale); x++) {
      let index = x + y * floor(width / scale);
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  zoff += 0.01;

  // Atualizar e desenhar partículas
  for (let particle of particles) {
    particle.follow(flowfield);
    particle.move();
    particle.update();
    particle.show();
    particle.checkEdges();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Ajustar número de partículas dinamicamente
function adjustParticles(newNum) {
  particles = [];
  for (let i = 0; i < newNum; i++) {
    let loc = createVector(random(width * 1.2), random(height), 2);
    let dir = createVector(cos(0), sin(0));
    let speed = random(0.5, 2);
    particles.push(new Particle(loc, dir, speed));
  }
}

// Classe Partícula
class Particle {
  constructor(_loc, _dir, _speed) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.hue = random(360); // Cor inicial da partícula
  }

  move() {
    let angle = noise(this.loc.x / noiseScale, this.loc.y / noiseScale, frameCount / noiseScale) * TWO_PI * noiseStrength;
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    let vel = this.dir.copy();
    vel.mult(this.speed);
    this.loc.add(vel);
  }

  follow(flowfield) {
    let x = floor(this.loc.x / scale);
    let y = floor(this.loc.y / scale);
    let index = x + y * floor(width / scale);
    let force = flowfield[index];
    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    if (colorModeType === "Rainbow") {
      stroke(this.hue, 255, 255, 250);
    } else if (colorModeType === "Monochrome") {
      stroke(255, 255, 255, 250); // Branco
    } else if (colorModeType === "Custom") {
      stroke(random(255), random(255), random(255), 250); // Cores aleatórias
    }
    strokeWeight(strokeWeightValue);
    point(this.loc.x, this.loc.y);
    this.hue = (this.hue + 1) % 360; // Alteração gradual de cor
  }

  checkEdges() {
    if (this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height) {
      this.loc.x = random(width * 1.2);
      this.loc.y = random(height);
    }
  }
}
