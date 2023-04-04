let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  uniform mat4 u_xformMatrix;
  void main(){
    gl_Position = u_xformMatrix * a_Position;
  }
  `;
let FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,0.7);
  }
  `;
let ANGLE = 45.0;
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('创建上下文失败');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  let n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('顶点缓冲区初始化失败');
    return;
  }

  let xformMatrix = new Matrix4();
  let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!u_xformMatrix) {
    console.log('获取变量失败');
    return;
  }

  
  let m = new Matrix4();
  m.setScale(1, 2, 3);
  let mat4 = new Matrix4();
  mat4.set(m);
  // true
  console.log(m.elements.toString() === mat4.elements.toString());
  // console.log(mat4.set(m).elements);
  /**
   * [
   *  1, 0, 0, 0,
   *  0, 2, 0, 0,
   *  0, 0, 3, 0,
   *  0, 0, 0, 4
   * ]
   */

  gl.uniformMatrix4fv(u_xformMatrix, false, mat4.elements);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  // setInterval(() => {
  //   ANGLE += 1;
  //   xformMatrix.setRotate(ANGLE, -1, 1, -1);
  //   gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  //   gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //   gl.clear(gl.COLOR_BUFFER_BIT);
  //   gl.drawArrays(gl.TRIANGLES, 0, n);
  // },10)

}

function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    0.0, 0.3, -0.3, -0.3, 0.3, -0.3
  ]);
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) { return -1; }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length / 2;
}