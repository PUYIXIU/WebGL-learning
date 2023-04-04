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
  uniform vec4 u_Color;
  void main(){
    gl_FragColor = u_Color;
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
  let u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  if (a_Position < 0 || !u_Color) {
    console.log('failed to get variable location');
    return;
  }
  canvas.onmousedown = function (ev) {
    drawPoint(gl, canvas, ev, a_Position, u_Color);
  }
}

let g_Points = [];
function drawPoint(gl, canvas, ev, a_Position, u_Color) {
  let ex = ev.x, ey = ev.y;
  let cw = canvas.width, ch = canvas.height;
  let rect = ev.target.getBoundingClientRect();
  let x = (ev.x - cw / 2 - rect.left) / (cw / 2);
  let y = (ch / 2 + rect.top - ev.y) / (ch / 2);
  let color = [
    Math.random().toFixed(2),
    Math.random().toFixed(2),
    Math.random().toFixed(2),
    0.75
  ]
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_Points.push([x, y, ...color]);
  g_Points.forEach(p => {
    gl.vertexAttrib3f(a_Position, p[0], p[1], 0.0);
    gl.uniform4f(u_Color, p[2], p[3], p[4], p[5]);
    gl.drawArrays(gl.POINTD, 0, 1);
  })
}