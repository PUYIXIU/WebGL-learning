// let VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     void main(){
//       gl_Position = a_Position;
//     }
//   `;
// let FSHADER_SOURCE =
//   `
//   precision mediump float;
//   uniform float u_Width;
//   uniform float u_Height;
//   void main(){
//     gl_FragColor = vec4(
//       0.0,
//       gl_FragCoord.x/u_Width,
//       gl_FragCoord.y/u_Height,
//       1.0
//     );
//   }
//   `;
// function initVertexBuffer(gl) {
//   let vertices = new Float32Array([
//     0.0, 0.5, -0.5, -0.5, 0.5, -0.5
//   ]);
//   let n = 3;
//   let vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     return -1;
//   }
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);
//   return n;
// }
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log('获取上下文失败');
//     return;
//   }
//   if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffer(gl);
//   if (n < 0) {
//     console.log('创建缓冲区失败');
//     return;
//   }
//   let u_Width = gl.getUniformLocation(gl.program, 'u_Width'),
//     u_Height = gl.getUniformLocation(gl.program, 'u_Height');
//   gl.uniform1f(u_Width, canvas.width);
//   gl.uniform1f(u_Height, canvas.height);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }

let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  void main(){
    gl_Position = a_Position;
  }
  `;
let FSHADER_SOURCE =
  `
  precision mediump float;
  uniform float u_Width;
  uniform float u_Height;
  void main(){
    gl_FragColor = vec4(
      gl_FragCoord.x / u_Width,
      0.0,
      gl_FragCoord.y / u_Height,
      1.0
    );
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
  let u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  let u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  gl.uniform1f(u_Width, canvas.width);
  gl.uniform1f(u_Height, canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
function initVertexBuffer(gl) {
  let verticesColor = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  let n = 3;
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return n;
}