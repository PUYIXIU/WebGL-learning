let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main(){
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`;

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
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('failed to get a_Position location');
    return;
  }
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);
}