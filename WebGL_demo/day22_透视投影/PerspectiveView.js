let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
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
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  let n = initVertexBuffers(gl);

  let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  let viewMatrix = new Matrix4();
  viewMatrix.setLookAt(
    0, 0, 5,
    0, 0, -10,
    0, 1, 0
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  let projMatrix = new Matrix4();

  document.onkeydown = function (ev) {
    keydown(canvas,gl,ev,n,u_ProjMatrix,projMatrix,nf);
  }
  draw(canvas,gl,n,u_ProjMatrix,projMatrix,nf);
}

let g_fov = 30.0;
let g_far = 100.0;
function keydown(canvas,gl,ev,n,u_ProjMatrix,projMatrix,nf) {
  switch (ev.keyCode) {
    case 37: g_far -= 1.0; break;
    case 38: g_fov += 1.0; break;
    case 39: g_far += 1.0; break;
    case 40: g_fov -= 1.0; break;
    default: break;
  }
  draw(canvas,gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(canvas,gl,n,u_ProjMatrix,projMatrix,nf) {
  projMatrix.setPerspective(g_fov, canvas.width / canvas.height, 1.0, g_far);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  nf.innerHTML = 'fov:' + Math.round(g_fov * 10) / 10 + ' far:' + Math.round(g_far * 10) / 10;
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
    //* 右侧3个三角形
    // 绿色-最后
    0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    1.25, -1.0, -4.0, 1.0, 0.4, 0.4,
    // 黄色-中间
    0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
    0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,
    // 蓝色-最前
    0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    1.25, -1.0, 0.0, 1.0, 0.4, 0.4,
    
    //* 左侧3个三角形
    // 绿色-最后
    -0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
    -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,
    // 黄色-中间
    -0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
    -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,
    // 蓝色-最前
    -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
    -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,
  ]);
  let n = 18;
  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
  gl.enableVertexAttribArray(a_Color);
  return n;
}