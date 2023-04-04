// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   attribute vec4 a_Color;
//   uniform mat4 u_ViewMatrix;
//   varying vec4 v_Color;
//   void main(){
//     gl_Position = u_ViewMatrix * a_Position;
//     v_Color = a_Color;
//   }
//   `;
// let FSHADER_SOURCE =
//   `
//   #ifdef GL_ES
//     precision mediump float;
//   #endif
//   varying vec4 v_Color;
//   void main(){
//     gl_FragColor = v_Color;
//   }
//   `;
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffer(gl);

//   // 获取u_ViewMatrix
//   let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  
//   // 设置视点、视线、上方向
//   let viewMatrix = new Matrix4();

//   /**
//    * 视点  0.20 0.25 0.25
//    * 观察点 0 0 0
//    * 上方向 0 1 0
//    */
//   // viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
//   viewMatrix.setLookAt(
//     -0.2, 0.2 , -0.9,
//     0, 0, 0.0,
//     0, 1, 0);

//   // 将视图矩阵传入顶点着色器
//   gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }
// function initVertexBuffer(gl) {
//   let verticesColors = new Float32Array([
//     // 绿色三角形
//     0.0, 0.5, -0.9, 0.0, 1.0, 0.0,
//     -0.5, -0.5, -0.9, 0.0, 1.0, 0.0,
//     0.5, -0.5, -0.9,  0.0, 1.0, 0.0,
//     // 黄色三角形
//     0.5, 0.4, -0.4, 1.0, 0.0, 0.0,
//     -0.5, 0.4, -0.4, 1.0, 0.0, 0.0,
//     0.0, -0.6, -0.4, 1.0, 0.0, 0.0,
//     // 蓝色三角形
//     0.0, 0.5, 0.0, 0.0, 0.0, 1.0,
//     -0.5, -0.5, 0.0,0.0, 0.0, 1.0,
//     0.5, -0.5, 0.0, 0.0, 0.0, 1.0
//   ]);
//   let n = 9;
//   let FSIZE = verticesColors.BYTES_PER_ELEMENT;
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
//   let vertexColorBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

//   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
//   gl.enableVertexAttribArray(a_Position);
//   gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
//   gl.enableVertexAttribArray(a_Color);
//   return n;
// }

// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   attribute vec4 a_Color;
//   uniform mat4 u_ViewMatrix;
//   varying vec4 v_Color;
//   void main(){
//     gl_Position = u_ViewMatrix * a_Position;
//     v_Color = a_Color;
//   }
//   `;

let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_rotMatrix;
  void main(){
    gl_Position = u_rotMatrix * a_Position;
    v_Color = a_Color;
  }
  `;

let FSHADER_SOURCE =
  `
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
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  let n = initVertexBuffer(gl);

  // let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  // let viewMatrix = new Matrix4();
  // viewMatrix.setLookAt(
  //   0.2, 0.25, 0.25,
  //   0.0, 0.0, 0.0,
  //   0.0, 1.0, 0.0
  // );
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  let u_rotMatrix = gl.getUniformLocation(gl.program, 'u_rotMatrix');
  let rotMatrix = new Matrix4();
  rotMatrix.setRotate(90, 0, 0, 1);
  gl.uniformMatrix4fv(u_rotMatrix, false, rotMatrix.elements);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  
}
function initVertexBuffer(gl) {
  let verticesColors = new Float32Array([
    // 红色三角形 最下层
    0.0, 0.5, -1.0, 1.0, 0.4, 0.4, 
    -0.5, -0.5, -1.0, 1.0, 0.3, 0.5, 
    0.5, -0.5, -1.0, 1.0, 1.0, 0.3, 
    // 绿色三角形 中间层
    0.0, -0.6, -1.0, 0.4, 1.0, 0.4, 
    -0.5, 0.5, -1.0, 0.3, 1.0, 0.5, 
    0.5, 0.5, -1.0, 1.0, 1.0, 0.3, 
    // 蓝色三角形 最上层
    0.0, 0.5, -1.0, 0.4, 0.4, 1.0, 
    -0.5, -0.5, -1.0, 0.3, 0.5, 1.0, 
    0.5, -0.5, -1.0, 0.5, 1.0, 1.0
  ]);
  let n = 9;
  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);
  return n;
}