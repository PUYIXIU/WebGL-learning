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
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('failed to get a_Position\'s Locaiton');
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  canvas.onmousedown = function (ev) {
    drawPoint(gl, canvas, ev, a_Position);
  }
}

let g_Points = [];
function drawPoint(gl, canvas, ev, a_Position) {
  let ex = ev.x, ey = ev.y;
  let cw = canvas.width, ch = canvas.height;
  let rect = ev.target.getBoundingClientRect();
  let x = (ex - cw / 2 - rect.left) / (cw / 2);
  let y = (ch / 2 + rect.top - ey) / (ch / 2);
  g_Points.push([x, y]);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_Points.forEach(p => {
    gl.vertexAttrib3f(a_Position, p[0], p[1], 0);
    gl.drawArrays(gl.POINT, 0, 1);
  })
}