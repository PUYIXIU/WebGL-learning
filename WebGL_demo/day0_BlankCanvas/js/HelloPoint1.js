let VSHADER_SOURCE = `
  void main(){  
    gl_Position = vec4(0.0,0.0,0.0,1.0);
    gl_PointSize = 10.0;
  }
`

let FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,1.0);
  }
`;

function main() { 
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('failed to get webgl context');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}