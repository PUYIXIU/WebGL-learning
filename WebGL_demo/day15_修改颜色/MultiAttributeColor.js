// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   attribute vec4 a_Color;
//   varying vec4 v_Color; // varying变量声明
//   void main(){
//     gl_Position = a_Position;
//     gl_PointSize = 10.0;
//     v_Color = a_Color; // 将数据传递给Fragment_Shader
//   }
//   `;
// let FSHADER_SOURCE =
//   `
//   precision mediump float;
//   varying vec4 v_Color;
//   void main(){
//     gl_FragColor = v_Color; // 从顶点着色器接受数据
//   }
//   `;
// function initVertexBuffer(gl) {
//   let verticesColors = new Float32Array([
//     0.0, 0.5, 1.0, 0.0, 0.0,
//     -0.5, -0.5, 0.0, 1.0, 0.0,
//     0.5, -0.5, 0.0, 0.0, 1.0
//   ]);
//   let n = 3;
//   let FSIZE = verticesColors.BYTES_PER_ELEMENT;
//   let vertexColorBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
//   gl.enableVertexAttribArray(a_Position);

//   let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
//   gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
//   gl.enableVertexAttribArray(a_Color);

//   return n;
// }

// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffer(gl);
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   // gl.drawArrays(gl.POINTS, 0, n);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }
let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  void main(){
    gl_Position = a_Position;
    gl_PointSize = 10.0;
    v_Color = a_Color;
  }
  `;
let FSHADER_SOURCE =
  `
  precision mediump float;
  varying vec4 v_Color;
  void main(){
    gl_FragColor = v_Color;
  }
  `;
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
  let n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('缓冲区初始化失败');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINT, 0, n);
  gl.drawArrays(gl.LINE_LOOP, 0, n);
} 
function initVertexBuffer(gl) {
  let verticesColor = new Float32Array([
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0
  ]);
  let n = 3;
  let vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('创建缓冲区失败');
    return -1;
  }
  let FSIZE = verticesColor.BYTES_PER_ELEMENT;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);
  return n;
} 