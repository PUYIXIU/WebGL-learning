// // 顶点着色器
// var VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     uniform vec4 u_Translation;
//     void main(){
//       gl_Position = a_Position + u_Translation;
//     }
//   `;
// // 片元着色器
// var FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,1.0,0.0,0.4);
//     }
//   `;
// // 在x、y、z方向上平移的距离
// var Tx = 0.5,
//   Ty = 0.5,
//   Tz = 0.0;
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
//   // 设置点位
//   var n = initVertexBuffer(gl);
//   if (n < 0) {
//     console.log('缓冲区初始化失败');
//     return;
//   }
//   // 将平移距离传输给顶点着色器
//   var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
//   if (!u_Translation) {
//     console.log('变量获取失败');
//     return;
//   }
//   gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }

// function initVertexBuffer(gl) {
//   let vertices = new Float32Array([
//     0.0, 0.5,
//     -0.5, -0.5,
//     0.5, -0.5
//   ]);
//   let n = vertices.length / 2;
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

// let VSHADER_SOURCE =
//   `
//    attribute vec4 a_Position;
//    void main(){
//     gl_Position = a_Position;
//     gl_PointSize = 10.0;
//    }
//   `;
// let FSHADER_SOURCE =
//   `
//    precision mediump float;
//    uniform vec4 u_FragColor;
//    void main(){
//     gl_FragColor = u_FragColor;
//    }
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
//   let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
//   if (a_Position < 0 || !u_FragColor) {
//     console.log('获取变量失败');
//     return;
//   }

//   canvas.onmousedown = (e) => drawPoint(e, gl, canvas, a_Position, u_FragColor)
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
// }


// let g_Position = [];
// let g_Color = [];
// let buffer_Array = [];

// function drawPoint(ev, gl, canvas, a_Position, u_FragColor) {

//   let x = ev.clientX,
//     y = ev.clientY,
//     rect = ev.target.getBoundingClientRect();
//   x = (x - canvas.width / 2 - rect.left) / (canvas.width / 2);
//   y = (canvas.height / 2 + rect.top - y) / (canvas.height / 2);
//   g_Position.push([x, y]);
//   g_Color.push([
//     Math.random().toFixed(2),
//     Math.random().toFixed(2),
//     Math.random().toFixed(2),
//     0.7
//   ]);
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   switch (g_Position.length % 3) {
//     case 0: //三角形
//       for (let i = 0; i < g_Position.length; i += 3) {
//         initVertexBuffer(gl, a_Position, g_Position.slice(i, 3));
//         gl.uniform4f(u_FragColor, g_Color[i][0], g_Color[i][1], g_Color[i][2], g_Color[i][3]);
//         gl.drawArrays(gl.TRIANGLES, 0, 3);
//       };
//       break;
//     case 1: //点

//       initVertexBuffer(gl, a_Position, g_Position.slice(-1));
//       gl.drawArrays(gl.POINT, 0, 1);
//       for (let i = 0; i < g_Position.length - 1; i += 3) {
//         initVertexBuffer(gl, a_Position, g_Position.slice(i, 3));
//         gl.uniform4f(u_FragColor, g_Color[i][0], g_Color[i][1], g_Color[i][2], g_Color[i][3]);
//         gl.drawArrays(gl.TRIANGLES, 0, 3);
//       };
//       break;
//     case 2: //线

//       initVertexBuffer(gl, a_Position, g_Position.slice(-2,2));
//       gl.drawArrays(gl.LINES, 0, 2);
//       for (let i = 0; i < g_Position.length - 2; i += 3) {
//         initVertexBuffer(gl, a_Position, g_Position.slice(i, 3));
//         gl.uniform4f(u_FragColor, g_Color[i][0], g_Color[i][1], g_Color[i][2], g_Color[i][3]);
//         gl.drawArrays(gl.TRIANGLES, 0, 3);
//       };
//       break;
//   }
// }

// function initVertexBuffer(gl, a_Position, ele_Position) {
//   let vertices = new Float32Array(ele_Position.flat());
//   let vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     return -1;
//   }
//   buffer_Array.push(vertexBuffer);
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);
//   return vertices.length / 2;
// }

var VSHADER_SOURCE =
  `
   attribute vec4 a_Position;
   uniform vec4 u_Translation;
   void main(){
    gl_Position = a_Position + u_Translation;
   }
  `;
var FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,0.4);
  }
  `;
var Tx = 0.5,
  Ty = 0.5,
  Tz = 0.0;

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
  var n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('缓冲区初始化失败');
    return;
  }
  let u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  if (!u_Translation) {
    console.log('变量获取失败');
    return;
  }
  gl.uniform4f(u_Translation, Tx, Ty, Tz,0.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length / 2;
 }
