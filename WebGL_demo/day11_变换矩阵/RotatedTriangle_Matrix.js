var VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  uniform mat4 u_xformMatrix;
  void main(){
    gl_Position = u_xformMatrix * a_Position ;
  }
  `;
var FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,0.4);
  }
  `;
// 旋转角度
let ANGLE = 10.0;
let Tx = 0.2,
  Ty = 0.2,
  Tz = 0.0;
let Sx = 2.7,
  Sy = 1.8,
  Sz = 1.0;
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('获取上下文失败');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  // 设置顶点位置
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('缓冲区初始化失败');
    return;
  }
  // 创建旋转矩阵
  let radian = Math.PI * ANGLE / 180.0;
  let cosB = Math.cos(radian), sinB = Math.sin(radian);
  // WebGL中矩阵是列主序的
  // let xformMatrix = new Float32Array([
  //   cosB, sinB, 0, 0,
  //   -sinB, cosB, 0, 0,
  //   0, 0, 1, 0,
  //   0, 0, 0, 1
  // ]);
  // let xformMatrix = new Float32Array([
  //   1.0, 0.0, 0.0, 0.0,
  //   0.0, 1.0, 0.0, 0.0,
  //   0.0, 0.0, 1.0, 0.0,
  //   Tx, Ty, 0.0, 1.0
  // ]);
  let xformMatrix = new Float32Array([
    Sx, 0, 0, 0,
    0, Sy, 0, 0,
    0, 0, Sz, 0,
    0, 0, 0, 1.0
  ])
  let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!u_xformMatrix) {
    console.log('获取变量失败');
    return;
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffers(gl) {
  let vertices = new Float32Array([
    0.0, 0.3, -0.3, -0.3, 0.3, -0.3
  ]);
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length / 2;
}