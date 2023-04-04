
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
  //   v6------ v5
  //  /|        /|
  // v1--------v0|
  // | |       | |
  // | |v7-----|-|v4
  // |/        |/
  // v2-------v3

  let vertices = new Float32Array([
    // font-back-left-right-up-down
    1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, //front v0-v1-v2-v3
    1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1,//back v5-v6-v7-v4
    -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, //left v1-v2-v7-v6
    1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,//right v0-v3-v4-v5
    1, 1, 1, -1, 1, 1, -1, 1, -1, 1, 1, -1,//up v0-v1-v6-v5
    1, -1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1//down v3-v2-v7-v4
  ]);
  // let colors = new Float32Array([
  //   0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //front
  //   0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, //back
  //   1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //left
  //   0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, //right
  //   1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, //up
  //   1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //down
  // ]);

  let colors = new Float32Array([
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
  ]);
  let indices = new Int8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // back
    8, 9,10,   8,10,11,    // left
   12,13,14,  12,14,15,    // right
   16,17,18,  16,18,19,    // up
   20,21,22,  20,22,23     // down
  ]);
  let indexBuffer = gl.createBuffer();
  initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
  initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  let a_attribute = gl.getAttribLocation(gl.program, attribute);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0,);
  gl.enableVertexAttribArray(a_attribute);
}