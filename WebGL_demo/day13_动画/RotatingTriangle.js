// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   uniform mat4 u_ModelMatrix;
//   void main(){
//     gl_Position = u_ModelMatrix * a_Position;
//   }
//   `;
// let FSHADER_SOURCE =
//   `
//   void main(){
//     gl_FragColor = vec4(0.0,1.0,0.0,0.5);
//   }
//   `;
// let ANGLE_STEP = 60.0;
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffer(gl);
//   let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);

//   // 三角形当前旋转角度
//   let currentAngle = 0.0;
//   // 模型矩阵 Matrix4对象
//   let modelMatrix = new Matrix4();

//   // 开始绘制三角形
//   var tick = function () {
//     // 更新旋转角
//     currentAngle = animate(currentAngle);
//     draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);

//     // 请求浏览器调用tick
//     requestAnimationFrame(tick);
//   };

//   tick();



//   let upButton = document.getElementById('up');
//   let downButton = document.getElementById('down');
//   upButton.addEventListener('click', () => ANGLE_STEP += 5);
//   downButton.addEventListener('click', () => {
//     if (ANGLE_STEP > 0) {
//       ANGLE_STEP -= 5;
//     }
//   })

// }

// function initVertexBuffer(gl) {
//   let vertices = new Float32Array([
//     0.0, 0.25, -0.25, -0.25, 0.25, -0.25
//   ]);
//   let vertexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);
//   return vertices.length / 2;
// }

// function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
//   // 设置旋转矩阵
//   modelMatrix.setRotate(currentAngle, 0, 0, 1);
//   modelMatrix.translate(0.35, 0, 0);

//   // 将旋转矩阵传输给顶点着色器
//   gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
//   // 清除canvas
//   gl.clear(gl.COLOR_BUFFER_BIT);
  
//   // 绘制三角形
//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }

// // 记录上一次调用函数的时刻
// let g_last = Date.now();
// function animate(angle) {
//   // 计算距离上次调用经过多长时间
//   var now = Date.now();
//   var elapsed = now - g_last; // 毫秒
//   g_last = now;
//   // 根据距离上次调用的时间，更新当前旋转角度
//   let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
//   return newAngle %= 360;
// }


let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main(){
    gl_Position = u_ModelMatrix * a_Position;
    // gl_Position = a_Position;
  }
  `;
let FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.5,0.0,0.2,0.3);
  }
  `;
let ANGLE_STEP = 180.0;
let g_last = Date.now();
// 创建顶点缓冲区
function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    0, 0,
    0, 0.1,
    -0.07, 0.19,
    -0.1, 0.2,
    -0.15, 0.2,
    -0.2, 0.17,
    -0.23, 0.14,
    -0.25, 0.07,
    -0.23, 0.0,
    -0.21, -0.04,
    -0.19, -0.07,
    0, -0.2,
    0.19, -0.07,
    0.21, -0.04,
    0.23, 0.0,
    0.25, 0.07,
    0.23, 0.14,
    0.2, 0.17,
    0.15, 0.2,
    0.1, 0.2,
    0.07, 0.19,
    0,0.1
  ]);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length / 2;
}

// 每帧重绘
function draw(gl,modelMatrix,u_ModelMatrix,currentAngle,n) {
  modelMatrix.setRotate(currentAngle, 0, 1, 0);
  modelMatrix.scale(2, 2, 2);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
} 

// 计算运动轨迹
function animate(currentAngle) {
  let now = Date.now();
  let elapsed = now - g_last;
  g_last = now;
  let nowAngle = currentAngle + ANGLE_STEP / 1000.0 * elapsed;
  return nowAngle % 360;
}

function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  let n = initVertexBuffer(gl);
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  let modelMatrix = new Matrix4();
  gl.clearColor(0.1, 0.4, 0.1, 0.7);
  let currentAngle = 0;
  let tick = function () {
    currentAngle = animate(currentAngle);
    draw(gl, modelMatrix, u_ModelMatrix, currentAngle, n);
    requestAnimationFrame(tick);
  }
  tick();

}
