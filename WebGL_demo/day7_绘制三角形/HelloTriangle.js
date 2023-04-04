// // 顶点着色器
// var VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     void main(){
//       gl_Position = a_Position;
//     }
//   `;
// // 片源着色器
// var FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,1.0,0.0,0.4);
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
//   // 设置顶点位置
//   let n = initVertexBuffer(gl);
//   if (n < 0) {
//     console.log('缓存区初始化失败');
//     return;
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }

// function initVertexBuffer(gl) {
//   let vertices = new Float32Array([
//     0.0,0.5,-0.5,-0.5,0.5,-0.5
//   ]);
//   let n = vertices.length / 2;
//   // 创建缓冲区
//   let vertexBuffer = gl.createBuffer();
//   // 绑定缓冲区
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   // 写入缓冲区
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   // 分配变量给缓冲区
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   // 连通变量与缓冲区
//   gl.enableVertexAttribArray(a_Position);

//   return n;
// };

// let VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     void main(){
//       gl_Position = a_Position;
//     }
//   `;
// let FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(1.0,0.0,0.0,0.5);
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
//   let n = initVertexBuffer(gl);
//   if (n < 0) {
//     return;
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }
// function initVertexBuffer(gl) {
//   let vertices = new Float32Array([
//     0.0, 0.5, -0.5, -0.5, 0.5, -0.5
//   ]);
//   let n = vertices.length / 2;
//   let vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('缓冲区创建失败');
//     return -1;
//   }
//   gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);
//   return n;
// }

// 1、顶点着色器
let VSHADER_SOURCE =
  `
    attribute vec4 a_Position;
    void main(){
      gl_Position = a_Position;
      gl_PointSize = 10.0;
    }
  `;
// 2、片元着色器
let FSHADER_SOURCE =
  `
    void main(){
      gl_FragColor = vec4(0.0,1.0,0.0,1.0);
    }
  `;
function main() { 
// 3、获取canvas
  let canvas = document.getElementById('webgl');
// 4、获取上下文
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('获取上下文失败');
    return;
  }
// 5、着色器初始化
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
// 6、设置顶点位置
  let n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('缓冲区初始化失败');
    return
  }
// 7、清空绘图区
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
// 8、开始绘图
  // gl.drawArrays(gl.POINTS, 0, n); // 点
  // gl.drawArrays(gl.LINES, 0, n); // 线段
  // gl.drawArrays(gl.LINE_STRIP, 0, n); // 线条
  // gl.drawArrays(gl.LINE_LOOP, 0, n); // 回路
  // gl.drawArrays(gl.TRIANGLES, 0, n); // 三角形
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 三角带
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n); // 三角扇
}

function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    0.0, 0.0,
    -0.3, 0.3,
    -0.5, 0.0,
    -0.2, -0.4,
    0.2, -0.4,
    0.5, 0.0,
    0.3, 0.3,
    0.1, 0.1,
    -0.1,0.1,
  ]);
  let n = vertices.length / 2;
  // 1、创建缓冲区
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    return -1;
  }
  // 2、绑定缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 3、写入缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // 4、分配变量
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 5、连通
  gl.enableVertexAttribArray(a_Position);
  return n;
}