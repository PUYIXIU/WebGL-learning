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
//   precision mediump float;
//   uniform vec4 u_FragColor;
//   void main(){
//     gl_FragColor = u_FragColor;
//   }
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
//   // 获取a_Position变量的存储位置
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   // 获取u_FragColor变量的存储位置
//   let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
//   if (a_Position < 0 || u_FragColor) {
//     console.log('获取变量存储位置失败');
//     return;
//   }

//   // 注册鼠标点击事件
//   canvas.onmousedown = function (ev) {
//     click(ev, gl, canvas, a_Position, u_FragColor);
//   }

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);

// }

// let gl_points = [];
// let gl_colors = [];
// function click(ev,gl,canvas,a_Position,u_FragColor) {
//   let x = ev.clientX;
//   let y = ev.clientY;
//   let rect = ev.target.getBoundingClientRect();
//   x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
//   y = (rect.top + canvas.height / 2 - y) / (canvas.height / 2);
//   gl_points.push([x, y]);
//   gl_colors.push([
//     Math.random().toFixed(1),
//     Math.random().toFixed(1),
//     Math.random().toFixed(1),
//     1.0,
//   ]);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl_points.forEach((point, index) => {
//     // 将坐标存储到gl_points数组中
//     gl.vertexAttrib2f(a_Position, point[0], point[1]);
//     //
//     gl.uniform4f(
//       u_FragColor,
//       gl_colors[index][0],
//       gl_colors[index][1],
//       gl_colors[index][2],
//       gl_colors[index][3]
//     )
//     gl.drawArrays(gl.POINTS, 0, 1);
//   })
// }

let VSHADER_SOURCE =
  `
    attribute vec4 a_Position;
    void main(){
      gl_Position = a_Position;
      gl_PointSize = 10.0;
    }
  `;
let FSHADER_SOURCE =
  `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
    gl_FragColor = u_FragColor;
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
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (a_Position < 0 || !u_FragColor) {
    console.log('获取变量地址失败');
    return;
  }
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas, a_Position, u_FragColor);
  };
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = [];
let g_colors = [];
function click(ev,gl,canvas,a_Position,u_FragColor) { 
  let x = ev.clientX;
  let y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (rect.top + canvas.height / 2 - y) / (canvas.height / 2);
  g_points.push([x, y]);
  g_colors.push([
    Math.random().toFixed(1),
    Math.random().toFixed(1),
    Math.random().toFixed(1),
    1.0
  ]);
  gl.clear(gl.COLOR_BUFFER_BIT);
  let len = g_points.length;
  for (let i = 0; i < len; i++){
    let pos = g_points[i];
    let col = g_colors[i];
    gl.vertexAttrib2f(a_Position, pos[0], pos[1]);
    gl.uniform4f(u_FragColor, col[0], col[1], col[2], col[3]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}