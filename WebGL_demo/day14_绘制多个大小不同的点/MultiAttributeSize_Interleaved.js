// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   attribute float a_PointSize;
//   void main(){
//     gl_Position = a_Position;
//     gl_PointSize = a_PointSize;
//   }
//   `;
// let FSHADER_SOURCE =
//   `
//   void main(){
//     gl_FragColor = vec4(0.0,1.0,0.0,0.4);
//   }
//   `;
// function initVertexBUffer(gl) {
//   let verticesSize = new Float32Array([
//     0.0, 0.5, 10.0, // 第一个点
//     -0.5, -0.5, 20.0, // 第二个点
//     0.5, -0.5, 30.0, // 第三个点
//   ])
//   let n = 3;
//   let vertexSizeBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesSize, gl.STATIC_DRAW);

//   let FSIZE = verticesSize.BYTES_PER_ELEMENT;
  
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
//   gl.enableVertexAttribArray(a_Position);

//   let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
//   gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false,FSIZE * 3, FSIZE * 2);
//   gl.enableVertexAttribArray(a_PointSize);
  
//   return n;
// }
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBUffer(gl);
//   gl.clearColor(0.0,0.0,0.0,1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.POINTS, 0, n);
// }

let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main(){
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }
  `;
let FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,0.5);
  }
  `;
function initVertexBuffer(gl) {
  let verticesSize = new Float32Array([
    0.0, 0.5, 10.0, // 第一个点
    -0.5, -0.5, 20.0, // 第二个点
    0.5, -0.5, 30.0, // 第三个点
  ]);
  let n = 3;
  let FSIZE = verticesSize.BYTES_PER_ELEMENT;
  let verticesSizeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSize, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position);

  let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  gl.enableVertexAttribArray(a_PointSize);

  return n;
}
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  let n = initVertexBuffer(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, n);
}