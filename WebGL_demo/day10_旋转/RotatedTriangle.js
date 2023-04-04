// // let VSHADER_SOURCE =
// //   `
// //   // x' = xcosb - ysinb
// //   // y' = xsinb + ycosb
// //   // z' = z
// //   attribute vec4 a_Position;
// //   uniform float u_CosB, u_SinB;
// //   void main(){
// //     gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
// //     gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
// //     gl_Position.z = a_Position.z;
// //     gl_Position.w = 5.0;
// //   }
// //   `;
// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   uniform vec2 u_CosBSinB;
//   void main(){
//     gl_Position.x = a_Position.x*u_CosBSinB.x - a_Position.y*u_CosBSinB.y;
//     gl_Position.y = a_Position.y*u_CosBSinB.x + a_Position.x*u_CosBSinB.y;
//     gl_Position.z = a_Position.z;
//     gl_Position.w = a_Position.w;
//   }
//   `;

// let FSHADER_SOURCE =
//   `
//   void main(){
//     gl_FragColor = vec4(0.0,1.0,1.0,0.24);
//   }
//   `;
// let ANGLE = 90.0;
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log('获取上下文失败');
//     return;
//   }
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffer(gl);
//   if (n < 0) {
//     console.log('缓冲区初始化失败');
//     return;
//   }

//   setInterval(() => {
//     ANGLE -= 1;
//      // 弧度制
//   let radian = Math.PI * ANGLE / 180;
//   let cosB = Math.cos(radian);
//   let sinB = Math.sin(radian);

  
//   // let u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
//   // let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
//   // if (!u_CosB || !u_SinB) {
//   //   console.log('获取变量失败');
//   //   return;
//   // }
//   // gl.uniform1f(u_CosB, cosB);
//   // gl.uniform1f(u_SinB, sinB);
    
//     let u_CosBSinB = gl.getUniformLocation(gl.program, 'u_CosBSinB');
//     gl.uniform2f(u_CosBSinB, cosB, sinB);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);

//   },1)

 
// }

// function initVertexBuffer(gl) {
//   let vertices = new Float32Array([
//     0.0, 0.5, -0.5, -0.5, 0.5, -0.5
//   ]);
//   let vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     return -1;
//   }
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   if (a_Position < 0) {
//     console.log('获取变量失败');
//     return -1;
//   }
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);
//   return vertices.length / 2;
// }

let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  uniform vec4 u_Transition;
  uniform vec2 u_SinCos;
  void main(){
    gl_Position.x = a_Position.x*u_SinCos.x - a_Position.y*u_SinCos.y + u_Transition.x;
    gl_Position.y = a_Position.y*u_SinCos.x + a_Position.x*u_SinCos.y + u_Transition.y;
    gl_Position.z = a_Position.z + u_Transition.z;
    gl_Position.w = a_Position.w;
  }
  `;
let FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,0.4);
  }
  `;
let ANGLE = 90,
  Tx = -0.2,
  Ty = 0.2,
  Tz = 0.0;
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { 
    return;
  }
  let n = initVertexBuffer(gl);
  let u_Transition = gl.getUniformLocation(gl.program, 'u_Transition');
  let u_SinCos = gl.getUniformLocation(gl.program, 'u_SinCos');
  gl.uniform4f(u_Transition, Tx, Ty, Tz, 0.0);
  gl.uniform2f(u_SinCos, Math.cos(Math.PI * ANGLE / 180), Math.sin(Math.PI * ANGLE / 180));
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    0.0, 0.6, -0.5, -0.5, 0.5, -0.5
  ]);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length / 2;
}