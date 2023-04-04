// let VSHADER_SOURCE = `
//   attribute vec4 a_Position;
//   attribute vec4 a_Color;
//   uniform mat4 u_MvpMatrix;
//   varying vec4 v_Color;
//   void main(){
//     gl_Position = u_MvpMatrix * a_Position;
//     v_Color = a_Color;
//   }
// `;

// let FSHADER_SOURCE = `
//   #ifdef GL_ES
//    precision mediump float;
//   #endif
//   varying vec4 v_Color;
//   void main(){
//     gl_FragColor = v_Color;
//   }
// `;

// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('failed to init shaders');
//     return;
//   }
  
//   let n = initVertexBuffers(gl);
//   let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
//   let mvpMatrix = new Matrix4();
//   mvpMatrix.setPerspective(30, 1, 1, 100);
//   mvpMatrix.lookAt(
//     3, 3, 7,
//     0, 0, 0,
//     0, 1, 0
//   );
//   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.enable(gl.DEPTH_TEST);
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//   gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
// }

// function initVertexBuffers(gl) {
//   let verticesColors = new Float32Array([
//     // Vertex coordinates and color
//      1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
//     -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
//     -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
//      1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
//      1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
//      1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
//     -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
//   ]);
//   let FSIZE = verticesColors.BYTES_PER_ELEMENT;
//   let indices = new Uint8Array([
//     0, 1, 2, 0, 2, 3, //前
//     0, 3, 4, 0, 4, 5, //右
//     0, 5, 6, 0, 6, 1, //上
//     1, 6, 7, 1, 7, 2, //左
//     7, 4, 3, 7, 3, 2, //下
//     4, 7, 6, 4, 6, 5, //后
//   ]);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   let a_Color = gl.getAttribLocation(gl.program, 'a_Color');

//   let vertexColorBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
//   gl.enableVertexAttribArray(a_Position);
//   gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
//   gl.enableVertexAttribArray(a_Color);

//   // write index buffer
//   let indexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
//   return indices.length;
// }

let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
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
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  
  let n = initVertexBuffers(gl);
  
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(
    30, 1, 1, 100
  ).lookAt(
    3, 3, 7, 0, 0, 0, 0, 1, 0
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.FEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

}

function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
     1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
    -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
    -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
     1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
     1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
     1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
    -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
  ]) 
  let indices = new Int8Array([
    0, 1, 2, 0, 2, 3,
    0, 1, 6, 0, 5, 6,
    0, 3, 4, 0, 4, 5,
    1, 2, 7, 1, 6, 7,
    5, 6, 7, 5, 4, 7,
    2, 3, 7, 4, 3, 7
  ]);
  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3*FSIZE);
  gl.enableVertexAttribArray(a_Color);

  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}