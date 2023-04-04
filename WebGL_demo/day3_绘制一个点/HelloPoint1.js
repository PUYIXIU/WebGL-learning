// // 顶点着色器程序
// var VSHADER_SOURCE =
//   `
//     void main(){
//       gl_Position = vec4(0.0,0.0,0.0,1.0); //设置坐标
//       gl_PointSize = 10.0; //设置尺寸
//     }
//   `;
// //片源着色器程序
// var FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(1.0, 0.0 ,0.0 ,1.0); //设置颜色
//     }
//   `;
// function main() {
//   // 获取canvas元素
//   var canvas = document.getElementById('webgl');

//   // 获取WebGL绘图上下文
//   var gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log('绘图上下文获取失败');
//     return;
//   }

//   // 初始化着色器
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }

//   // 设置画板背景色
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   // 清空画板
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   // 绘制点
//   gl.drawArrays(gl.POINTS, 0, 1);
// }

// var VSHADER_SOURCE =
//   `
//     void main(){
//       gl_Position = vec4(0.0,0.0,0.0,1.0);
//       gl_PointSize = 10.0;
//     }
//   `;
// var FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(1.0,0.0,0.0,1.0);
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
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.POINTS, 0, 1);
// }

// 顶点着色器程序
let VSHADER_SOURCE =
  `
    void main(){
      gl_Position = vec4(0.0,0.0,0.0,1.0);
      gl_PointSize = 10.0;
    }
  `;
// 片源着色器程序
let FSHADER_SOURCE =
  `
    void main(){
      gl_FragColor = vec4(0.0,1.0,0.0,1.0);
    }
  `;
/**
 * 1. 获取canvas元素
 * 2. 获取WebGL上下文
 * 3. 初始化着色器
 * 4. 设置画板背景色
 * 5. 清空画板
 * 6. 绘制点
 */
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get context');
    return;
  }
  if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
    console.log('Failed to init shaders');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS,0,1)
}