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
//   `
// function main() {
//   var canvas = document.getElementById('webgl');
//   var gl = getWebGLContext(canvas);
//   initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  
//   // 设置顶点位置
//   var n = initVertexBuffers(gl);
//   if (n < 0) {
//     console.log('设置顶点位置失败');
//     return;
//   }
  
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.POINTS, 0, n);
// }

// function initVertexBuffers(gl) {
//   var vertices = new Float32Array([
//     0.0, 0.5, -0.5, -0.5, 0.5, -0.5
//   ]);
//   var n = 3; //点数
  
//   // 创建缓冲区对象
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('创建缓冲区对象失败');
//     return -1;
//   }

//   // 将缓冲区对象绑定到目标
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//   // 向缓冲区对象中写入数据
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  
//   // 将缓冲区对象分配给a_Position变量
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//   // 连接a_Position变量与分配给它的缓冲区对象
//   gl.enableVertexAttribArray(a_Position);
//   return n;
// }

// let VSHADER_SOURCE =
//   `
//     attribute vec4 a_Position;
//     void main(){
//       gl_Position = a_Position;
//       gl_PointSize = 10.0;
//     }
//   `;
// let FSHADER_SOURCE =
//   `
//     void main(){
//       gl_FragColor = vec4(0.0,1.0,0.0,0.7);
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
//   let n = initVertexBuffers(gl);
//   if (n < 0) {
//     console.log('设置顶点位置失败');
//     return;
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   // gl.drawArrays(gl.POINTS, 0, n);
//   // gl.drawArrays(gl.POINTS, 0, 1);
//   gl.drawArrays(gl.POINTS, 1, 2);
// }

// function initVertexBuffers(gl) {
//   var vertices = new Float32Array(
//     [ 0, 0.5, -0.5, -0.5, 0.5, -0.5]
//   );
//   var n = vertices.length / 2; //点数

//   // 创建缓冲区对象
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('创建缓冲区对象失败');
//     return -1;
//   }
//   // 将缓冲区对象绑定到目标
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   // 向缓冲区对象写入数据
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   
//   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   // 将缓冲区对象分配给a_Position变量
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   // 连接a_Position变量与分配给它的缓冲区对象
//   gl.enableVertexAttribArray(a_Position);

//   return n;
// }

// function initVertexBuffers(gl) {
  
//   let vertices = new Float32Array(
//     [0, 0.5, -0.5, -0.5, 0.5, -0.5]
//   );
//   var n = vertices.length / 2;

//   // 1.创建缓冲区对象
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('创建缓冲区对象失败');
//     return -1;
//   }

//   // 2.绑定缓冲区对象
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   // 3.写入缓冲区对象
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   // 4.分配变量给缓冲区对象
//   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//   // 5.连接变量与缓冲区对象
//   gl.enableVertexAttribArray(a_Position);
//   return n;

// }

// 顶点着色器
let VSHADER_SOURCE =
  `
    attribute vec4 a_Position;
    void main(){
      gl_Position = a_Position;
      gl_PointSize = 10.0;
    }
  `;
// 片元着色器
let FSHADER_SOURCE =
  `
    void main(){
      gl_FragColor = vec4(0.0,1.0,0.0,0.5);
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
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('缓冲区对象初始化失败');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, n);
}

// function initVertexBuffers(gl) {
//   let vertices = new Float32Array([
//     0.0, 0.5, -0.5, -0.5, 0.5, -0.5
//   ]);
//   let n = vertices.length / 2;

//   // 创建缓冲区对象
//   let vertexBuffer = gl.createBuffer();
  
//   // 绑定缓冲区对象
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//   // 写入缓冲区对象
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//   // 分配变量到缓冲区对象
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
//   // 连通变量与缓冲区对象
//   gl.enableVertexAttribArray(a_Position);
//   return n;
// }

function initVertexBuffers(gl) {
  let vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  let n = vertices.length / 2;

  // 创建缓冲区
  let vertexBuffer = gl.createBuffer();

  // 绑定缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // 写入缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 分配变量给缓冲区
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 连通变量与缓冲区
  gl.enableVertexAttribArray(a_Position);

  return n;
}