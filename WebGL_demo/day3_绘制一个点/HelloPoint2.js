// // 顶点着色器
// var VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     void main(){
//       gl_Position = a_Position;
//       gl_PointSize = 10.0;
//     }
//   `;
// // 片源着色器
// var FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,1.0,0.0,1.0);
//     }
//   `;
// function main() {
//   // 获取canvas元素
//   var canvas = document.getElementById('webgl');

//   // 获取WebGL上下文
//   var gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log('获取上下文失败');
//     return;
//   }

//   // 初始化着色器
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('初始化着色器失败');
//     return;
//   }

//   // 获取attribute变量的存储位置
//   var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); //0
//   if (a_Position < 0) {
//     console.log('Failed to go get the storage location of a_Position');
//     return;
//   }

//   // 将顶点位置传输给attribute变量
//   gl.vertexAttrib3f(a_Position, -0.2, 0.5, 0.0);

//   // 设置canvas背景色
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);

//   // 清除canvas
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   // 绘制点位
//   gl.drawArrays(gl.POINTS, 0, 1);
// }


// let VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     attribute float a_PointSize;
//     void main(){
//       gl_Position = a_Position;
//       gl_PointSize = a_PointSize;
//     }
//   `;
// let FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,1.0,0.0,1.0);
//     }
//   `;
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
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
//   if (a_Position<0 || a_PointSize<0) {
//     console.log('获取变量地址失败');
//     return;
//   }
//   gl.vertexAttrib4f(a_Position, -0.2, 0.2, 0.0, 1.0);
//   gl.vertexAttrib1f(a_PointSize, 50.0);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.POINTS, 0, 1);
// }

// let VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     attribute float a_PointSize;
//     void main(){
//       gl_Position = a_Position;
//       gl_PointSize = a_PointSize;
//     }
//   `;
// let FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,0.0,1.0,0.5);
//     }
//   `;
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log('获取上下文失败');
//     return;
//   }
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('初始化着色器失败');
//     return;
//   }
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
//   if (a_PointSize < 0 || a_Position < 0) {
//     console.log('变量地址获取失败');
//     return;
//   }
//   gl.vertexAttrib1f(a_Position, 0);
//   gl.vertexAttrib1f(a_PointSize, 20);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.POINTS, 0, 1);
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
      gl_FragColor = vec4(0.0,1.0,0.0,0.7);
    }
  `;
function main() { 
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('上下文获取失败');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position < 0 || a_PointSize < 0) {
    console.log('获取变量地址失败');
    return;
  }
  gl.vertexAttrib3f(a_Position, -0.1, 0.0, 0.0);
  gl.vertexAttrib1f(a_PointSize, 10.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}