let fft;
let music;
let input;
let logo;

let bassEnergyRange = {
  low: 130,
  high: 255
};

let carpetShader;
let carpetBase = 1;
let newX = 0;
let newY = 0;
let oldX = 0;
let oldY = 0;
let img;
let flip = 0;
let pg;

let isCarpetScene = true;

let fontRegular;
let fontMedium;
let fontBold;

function preload(){
  // Load the shader
  carpetShader = new p5.Shader(this._renderer, vert, frag);

  // Load the image
  img = loadImage("assets/carpet.jpg");
  
  fontRegular = loadFont('assets/Montserrat-Regular.ttf');
  fontMedium = loadFont('assets/Montserrat-Medium.ttf');
  fontBold = loadFont('assets/Montserrat-Bold.ttf');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(1920, 1080, WEBGL);
  pg = createGraphics(width, height);
  if (flip == 1){
    pg.scale(1, -1);
    pg.image(img, 0, -height, width, height);
  }else{
    pg.image(img, 0, 0, width, height);
  }
  mouseX = width / 4;
  mouseY = height / 4;
  
  input = new p5.AudioIn();
  input.start();
  fft = new p5.FFT(0.8, 256);
  fft.setInput(input);
  
  textAlign(CENTER, CENTER);
}

function draw() { 
  let spectrum = fft.analyze();
  
  if(isCarpetScene) {
    // "bass", "lowMid", "mid", "highMid", "treble"
    let bass = fft.getEnergy("bass");
    let mapSize = 11 + (carpetBase * 1.5);
    
    let energyBass = map(bass, bassEnergyRange.low, bassEnergyRange.high, 0, 13, true);
    drawCarpetText();
    drawCarpetScene(energyBass);
    drawCarpetText();
  } else {
    // "bass", "lowMid", "mid", "highMid", "treble"
    let bass = fft.getEnergy("bass");
    let energyBass = map(bass, bassEnergyRange.low, bassEnergyRange.high, 0, width, true);
    drawTextScene(energyBass);
  }
}

function drawCarpetScene(energyBass) {
  if(keyIsDown(RIGHT_ARROW)) {
    carpetBase += 1;
  } if(keyIsDown(LEFT_ARROW)) {
    if(carpetBase > 1) {
      carpetBase -= 1;
    }
  }
  
  if (frameCount % 100 == 0){
    newX = random(width);
    newY = random(height);
  }
  if (newX > oldX) { mouseX-=1 }
  if (newX < oldX) { mouseX+=1 }
  if (newY > oldY) { oldY-=1 }
  if (newY < oldY) { mouseY+=1 }
  
  // shader() sets the active shader with our shader
  shader(carpetShader);
  
  //const mx = map(mouseX, 0, width, 0, 100);
  //const my = map(mouseY, 0, height, 0, 100);
  
  const mx = (energyBass * 1.5) + carpetBase;
  const my = (energyBass) + carpetBase;
   
  // Send the image to the shader
  carpetShader.setUniform("uTexture", pg);
  carpetShader.setUniform("uScale", [mx, my]);

  // rect gives us some geometry on the screen
  rect(width, height);
  // box(width, height);
}

function drawCarpetText() {
  textFont(fontMedium);
  textSize(120);
  fill(255, 255, 0, 255);
  text('B.L.M.D', 0, 0);
}

function drawTextScene(energyBass) {
  background(0);
  drawCarpetText();
}

function mousePressed() {
  userStartAudio();
}

function keyPressed() {
  if(key === 'q') {
    isCarpetScene = true;
  } else if(key === 'w') {
    isCarpetScene = false;
  } else if(key === '0') {
    let fs = fullscreen();
    fullscreen(!fs);
  } else if(keyCode  === UP_ARROW) {
    carpetBase += 200;
  } else if(keyCode  === DOWN_ARROW) {
    carpetBase = 0;
  }
}
 
