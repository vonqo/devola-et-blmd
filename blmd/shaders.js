var frag=`
precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uTexture;

uniform vec2 uScale;

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec2 wiggle = sin(uv * uScale) * 0.02;

  
  vec4 color = texture2D(uTexture, uv + wiggle);
  
  // Send the color to the screen
  gl_FragColor = color;

}
`;


var vert=`
attribute vec3 aPosition;

// P5 provides us with texture coordinates for most shapes
attribute vec2 aTexCoord;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexCoord;

void main() {
  // Copy the texcoord attributes into the varying variable
  vTexCoord = aTexCoord;
   
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
`;
