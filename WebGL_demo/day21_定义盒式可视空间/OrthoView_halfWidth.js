let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_ProjMatrix * a_Position;
    v_Color = a_Color;
  }
`;

let FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  varying vec4 v_Color;
  void main(){
    gl_FragColor = v_Color;
  }
`;

function main() {
  let canvas = document.getElementById('webgl');
  let nf = document.getElementById('nearFar');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('failed to get context');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('failed to init vertex buffers');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  let projMatrix = new Matrix4();

  document.onkeydown = function (ev) {
    keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
  }
  draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

let g_wh = [1.0, 1.0];
function keydown(ev,gl,n,u_ProjMatrix,projMatrix,nf) {
  switch (ev.keyCode) {
    case 39: g_wh[0] += 0.01; break;//右键
    case 37: g_wh[0] -= 0.01; break;//左键
    case 38: g_wh[1] += 0.01; break;//上键
    case 40: g_wh[1] -= 0.01; break;//下键
    default: break;
  }
  draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl,n,u_ProjMatrix,projMatrix,nf) {
  projMatrix.setOrtho(
    -g_wh[0], g_wh[0],
    -g_wh[1], g_wh[1],
    0.0, 2.0
  );
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // nf.innerHTML = 'near:' + Math.round(g_nf[0] * 100) / 100 +
  //   ',far:' + Math.round(g_nf[1] * 100) / 100;
  nf.innerHTML = 'width:' + g_wh[0].toFixed(2) + ',height:' + g_wh[1].toFixed(2);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  let verticesColor = new Float32Array([
    // 红色三角形
    0.0, 0.5, -0.4, 1.0, 0.4, 0.4,
    -0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
    0.5, -0.5, -0.4, 0.0, 0.4, 0.4,
    // 绿色三角形
    -0.4, 0.4, -0.2, 0.4, 1.0, 0.4,
    0.4, 0.4, -0.2, 0.4, 1.0, 0.4,
    0.0, -0.6, -0.2, 0.4, 0.0, 0.4,
    // 蓝色三角形
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, -0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, -0.0, 0.4, 0.4, 0.0
  ]);
  let n = 9;
  let FSIZE = verticesColor.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3*FSIZE);
  gl.enableVertexAttribArray(a_Color);
  return n;
}