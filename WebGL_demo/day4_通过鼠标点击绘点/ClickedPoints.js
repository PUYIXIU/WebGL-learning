// // 顶点着色器
// var VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     void main(){
//       gl_Position = a_Position;
//       gl_PointSize = 10.0;
//     }
//   `;
// // 片元着色器
// var FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,1.0,0.0,1.0);
//     }
//   `;
// function main() {
//   // 获取canvas元素
//   let canvas = document.getElementById('webgl');
//   // 获取WebGL上下文
//   let gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log('获取上下文失败');
//     return;
//   }
//   // 初始化着色器
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   // 获取attribute变量存储位置
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   if (a_Position < 0) {
//     console.log('变量内存获取失败');
//     return;
//   }
//   // 注册鼠标点击事件响应函数
//   // canvas.onmousedown = function (ev) {
//   //   click(ev, gl, canvas, a_Position);
//   // };

//   canvas.onmousedown = mousedown;

//   function mousedown(ev) {
//     click(ev, gl, canvas, a_Position);
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
// }



// var g_points = []; //鼠标点击位置数组
// function click(ev, gl, canvas, a_Position) {
//   var x = ev.clientX; //鼠标点击处x坐标
//   var y = ev.clientY; //鼠标点击处y坐标
//   var rect = ev.target.getBoundingClientRect();
//   x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
//   y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
//   // 将坐标存储到g_points数组中
//   g_points.push(x);
//   g_points.push(y);
//   // 清除canvas
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   var len = g_points.length;
//   for (var i = 0; i < len; i += 2){
//     // 将点的位置传递到变量中a_Position
//     gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
//     // 绘制点
//     gl.drawArrays(gl.POINTS, 0, 1);
//   }
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
      gl_FragColor = vec4(0.0,1.0,0.0,0.6);
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
    console.log('初始化着色器失败');
    return;
  }
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position < 0 || a_PointSize < 0) {
    console.log('变量内存位置获取失败');
    return;
  }
  gl.vertexAttrib1f(a_PointSize, 20.0);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  canvas.onmousedown = function (ev) { 
    click(ev, gl, canvas, a_Position);
  }
}

let gl_points = [];
function click(ev, gl, canvas, a_Position) {
  let x = ev.clientX,
      y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - y + rect.top) / (canvas.height / 2);
  gl_points.push([x, y]);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl_points.forEach(point => {
    gl.vertexAttrib3f(a_Position, point[0], point[1],0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  })
}