let libs = ["includes/libs/p5.glitch.js"];

let fft;
let input;
let glitch;

let carpet;

var bassEnergyRange = {
  low: 130,
  high: 255
};

function preload() {
  // font = loadFont('assets/BebasNeue-Regular.otf');
  // carpet = loadImage('assets/carpet.jpg');
}

function setup() {
  createCanvas(300, 300);
  background(0);
  
  input = new p5.AudioIn();
  input.start();
  
  fft = new p5.FFT(0.8, 256);
  fft.setInput(input);
  
  imageMode(CENTER);
  glitch = new Glitch();
  loadImage('assets/carpet.jpg', function(im){
    glitch.loadImage(im);
  });
}


function draw() {
  let spectrum = fft.analyze();
  
  let bass = fft.getEnergy("bass");
  let energyBass = map(bass, bassEnergyRange.low, bassEnergyRange.high, 0, width, true);
  
  drawCarpet();
}

function drawCarpet() {
  glitch.resetBytes();
  
  glitch.replaceBytes(100, 104); // swap all decimal byte 100 for 104
  glitch.randomBytes(1); // add one random byte for movement

  glitch.buildImage();
  image(glitch.image, width/2, height/2);
}

function keyTyped() {
  if(key === '0') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
