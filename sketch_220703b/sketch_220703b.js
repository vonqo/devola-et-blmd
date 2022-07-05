let gl;
let noctaves;
let colors;
let font;

let bassEnergyRange = {
  low: 130,
  high: 255
};

//var bassEnergyRange = {
//  low: 75,
//  high: 255
//};

let fft;
let music;
let input;
let logo;

let logoHeight = 0;
let logoMaxSize = 0;
let logoMinSize = 0;

let titleHeight = 0;
let titleSize = 0;

let clrIndex = 0;
const clr = [
  {
    /// black
    clrRed: 0,
    clrGreen: 0,
    clrBlue: 0,
    clrAlpha: 255
  },
  {
    /// white
    clrRed: 255,
    clrGreen: 255,
    clrBlue: 255,
    clrAlpha: 255
  },
  {
    /// purple
    clrRed: 96,
    clrGreen: 2,
    clrBlue: 204,
    clrAlpha: 255
  },
  {
    /// purple
    clrRed: 96,
    clrGreen: 2,
    clrBlue: 204,
    clrAlpha: 255
  }
];

function initColors() {
  for (var i = -10; i < 10; i++) {
    colors[i] = i;
    // colors[i] = random(-10, 40);
    // colors[i] = random(-20, 200);
  }
}

function preload() {
  // music = loadSound('bg_music.mp3');
  font = loadFont('assets/BebasNeue-Regular.otf');
  logo = loadImage('assets/et_logo_white.png');
}

function setup() {
  createCanvas(1920, 1080, WEBGL);
  
  textFont(font);
  input = new p5.AudioIn();
  input.start();
  
  gl = this.canvas.getContext('webgl');
  gl.disable(gl.DEPTH_TEST);
  
  noctaves = 1.5;
  colors = [];
  initColors();
  test = new p5.Shader(this._renderer, vert, frag); //shaders are loaded
  shader(test); //shaders are applied

  fft = new p5.FFT(0.8, 256);
  fft.setInput(input);
  
  logoHeight = -(43);
  titleHeight = -(height / 2.3);
  titleSize = height / 9;
  logoMaxSize = height / 1.15;
  logoMinSize = height / 1.5;
  
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(titleSize);
  // music.play();
}

function draw() {
  let spectrum = fft.analyze();
  
  // "bass", "lowMid", "mid", "highMid", "treble"
  let bass = fft.getEnergy("bass");
  let energyBass = map(bass, bassEnergyRange.low, bassEnergyRange.high, 0, width, true);
  let logoSize = map(bass, bassEnergyRange.low, bassEnergyRange.high, logoMinSize, logoMaxSize, true);
  console.log(energyBass);
  
  test.setUniform("iResolution", [width, height]); //pass some values to the shader
  test.setUniform("iTime", millis() * 0.001);
  test.setUniform('iMouse', [energyBass, 0]);
  test.setUniform("noctaves", noctaves);
  test.setUniform("c", colors);
  shader(test);
  box(width, height);
  
  drawLogo(logoSize);
  drawText();
}

function drawLogo(sz) {
  tint(
    clr[clrIndex].clrRed, 
    clr[clrIndex].clrGreen, 
    clr[clrIndex].clrBlue, 
    clr[clrIndex].clrAlpha
  );
  image(logo, 0, logoHeight, sz, sz);
}

function drawText() {
  text('EVEN TIDE', 0, titleHeight);
  fill(
    clr[clrIndex].clrRed, 
    clr[clrIndex].clrGreen, 
    clr[clrIndex].clrBlue, 
    clr[clrIndex].clrAlpha
  );
}

function mousePressed() {
  userStartAudio();
}

function keyTyped() {
  if(key === 'q') {
    clrIndex = 0;
  } else if(key === 'w') {
    clrIndex = 1;
  } else if(key === 'e') {
    clrIndex = 2;
  } else if(key === 'r') {
    clrIndex = 3;
  }
  
  if(key === '1') {
    noctaves = 1;
  } else if(key === '2') {
    noctaves = 2;
  } else if(key === '3') {
    noctaves = 3;
  } else if(key === '4') {
    noctaves = 4;
  } else if(key === '5') {
    noctaves = 5;
  } else if(key === '6') {
    noctaves = 6;
  } else if(key === '0') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
