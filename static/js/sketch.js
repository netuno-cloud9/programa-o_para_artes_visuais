// Variáveis de controle
let currentChapter = 0;
let transitioning = false;
let transitionAlpha = 0;
let nextChapter = 0;

// Variáveis gerais
let mountains = []; // Montanhas para o Capítulo 0
let stars = []; // Estrelas no fundo

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight); // Responsivo

  // Cria estrelas para o fundo
  for (let i = 0; i < 230; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.29),
      size: random(0.1, 2.5),
      brightness: random(150, 255),
      twinkleSpeed: random(0.01, 1.55), // Velocidade de cintilação
    });
  }

  setupChapter(currentChapter);
}

function draw() {
  // Céu gradiente inspirado em "Brilho Eterno de uma Mente sem Lembranças"
  setGradient(
    0,
    0,
    width,
    height,
    color(10, 10, 30), // Preto com azul profundo
    color(0, 60, 100), // Azul suave
    color(255, 250, 240), // Azul celestial
    color(0, 0, 0) // Volta ao preto para profundidade
  );

  if (currentChapter === 0) {
    drawStars(); // Desenha as estrelas no Capítulo 0
  }

  if (transitioning) {
    handleTransition();
  } else {
    drawChapterContent(currentChapter);
    drawNavigation();
  }
}

// Função para desenhar as estrelas com cintilação
function drawStars() {
  noStroke();
  for (let star of stars) {
    let twinkle = sin(frameCount * star.twinkleSpeed) * 60; // Cintilação
    fill(star.brightness + twinkle);
    ellipse(star.x, star.y, star.size);
  }
}

// Gradiente mais complexo para o céu
function setGradient(x, y, w, h, c1, c2, c3, c4) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c;
    if (inter < 0.33) {
      c = lerpColor(c1, c2, inter * 3);
    } else if (inter < 0.66) {
      c = lerpColor(c2, c3, (inter - 0.33) * 3);
    } else {
      c = lerpColor(c3, c4, (inter - 0.66) * 3);
    }
    stroke(c);
    line(x, i, x + w, i);
  }
}

// Função de transição entre capítulos
function handleTransition() {
  transitionAlpha += 10;
  fill(0, transitionAlpha);
  rect(0, 0, width, height);

  if (transitionAlpha >= 255) {
    transitioning = false;
    currentChapter = nextChapter;
    setupChapter(currentChapter);
    transitionAlpha = 0;
  }
}

// Função para desenhar os botões de navegação
function drawNavigation() {
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);

  if (currentChapter < 1) {
    if (
      mouseX > width - 150 &&
      mouseX < width - 50 &&
      mouseY > height - 70 &&
      mouseY < height - 30
    ) {
      fill(200);
      cursor(HAND);
    } else {
      fill(255);
      cursor(ARROW);
    }
    text("Avançar →", width - 100, height - 50);
  }
}

// Função para iniciar a transição
function startTransition(direction) {
  transitioning = true;
  transitionAlpha = 1;
  nextChapter = currentChapter + direction;
}

// Função que detecta cliques do mouse
function mousePressed() {
  if (
    currentChapter < 1 &&
    mouseX > width - 150 &&
    mouseX < width - 50 &&
    mouseY > height - 70 &&
    mouseY < height - 30
  ) {
    startTransition(1);
  }
}

function setupChapter(chapter) {
  if (chapter === 0) {
    createMountains();
  }
}

function drawChapterContent(chapter) {
  if (chapter === 0) {
    drawMountains();
    drawHeaderMessage(); // Chama a função para desenhar a mensagem inicial
  }
}

// Função para desenhar a mensagem inicial
function drawHeaderMessage() {
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("A dissonância é a verdade sobre a harmonia.", width / 2, height / 2 - 50);
}

// Montanhas com tons brancos e dourados
function createMountains() {
  mountains = [];
  let layers = 19; // Aumentado para mais camadas

  // Paleta de cores suaves, brancas com dourado
  let baseColors = [
    
    color(255, 255, 255, ), // Transparência suave
  ];

  for (let i = 0; i < layers; i++) {
    let yOffset = height * 0.95 - i * 7; // Reduzi o espaçamento entre as camadas
    let complexity = map(i, 0, layers - 1, 0.002, 0.01); // Suavidade do ruído
    let peakHeight = map(i, 0, layers - 1, 20, 124); // Altura progressiva
    let layerColor = lerpColor(
      baseColors[0],
      baseColors[baseColors.length - 1],
      i / (layers - 1)
    );

    layerColor.setAlpha(map(i, 0, layers - 1, 7, 155)); // Transparência progressiva

    mountains.push({ yOffset, peakHeight, complexity, color: layerColor });
  }
}

function drawMountains() {
  for (let i = 0; i < mountains.length; i++) {
    let layer = mountains[i];
    fill(layer.color);
    stroke(10, 55); // Stroke suave para definição
    strokeWeight(1.5); // Define a espessura do contorno
    beginShape();

    let noiseScale = layer.complexity;
    let peakHeight = layer.peakHeight;

    for (let x = -100; x <= width + 240; x += 1) {
      let baseY =
        layer.yOffset - noise(x * noiseScale, frameCount * 0.016) * peakHeight;

      let roundedY = baseY + sin(x * 0.1 + frameCount * 0.009) * 2; // Suavização adicional
      curveVertex(x, roundedY);
    }

    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

// Ajusta o canvas ao redimensionar a janela
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupChapter(currentChapter);
}
