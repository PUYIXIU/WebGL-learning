
// // 第1部分：设置顶点着色器
// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   attribute vec2 a_TexCoord;
//   varying vec2 v_TexCoord;
//   void main(){
//     gl_Position = a_Position;
//     v_TexCoord = a_TexCoord;
//   }
//   `;

// // 第2部分：设置片元着色器
// let FSHADER_SOURCE =
//   `
//   precision mediump float;
//   uniform sampler2D u_Sampler;
//   varying vec2 v_TexCoord;
//   void main(){
//     gl_FragColor = texture2D(u_Sampler,v_TexCoord);
//   }
//   `;

// // 第3部分：创建坐标缓冲区
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffers(gl);
//   if (n < 0) {
//     console.log('变量获取失败');
//     return;
//   }
//   if (!initTextures(gl, n)) {
//     console.log('纹理映射失败');
//     return;
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
// }

// function initVertexBuffers(gl) {
//   let verticesTexCoords = new Float32Array([
//     -0.5, 0.5, 0.0, 1.0,
//     -0.5, -0.5, 0.0, 0.0,
//     0.5, 0.5, 1.0, 1.0,
//     0.5, -0.5, 1.0, 0.0
//   ]);
//   let n = 4;
//   let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
//   let vertexTexCoordBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
//   gl.enableVertexAttribArray(a_Position);
//   let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
//   gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
//   gl.enableVertexAttribArray(a_TexCoord);
//   return n;
// }
// // 第4部分：准备纹理
// function initTextures(gl, n) {
//   // 创建纹理对象
//   let texture = gl.createTexture();

//   // 获取u_Sampler
//   let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

//   // 创建image
//   let image = new Image();

//   // 注册图像加载事件的响应函数
//   image.onload = function () {
//     loadTexture(gl, n, texture, u_Sampler, image);
//   };
//   // 浏览器加载图像
//   image.src = '../img/tobydog.jpg';
//   return true
// }

// // 第5部分：使用纹理
// function loadTexture(gl, n, texture, u_Sampler, image) {
//   // 对纹理图像进行y轴反转
//   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

//   // 开启0号纹理单元
//   gl.activeTexture(gl.TEXTURE0);

//   // 向target绑定纹理对象
//   gl.bindTexture(gl.TEXTURE_2D, texture);

//   // 配置纹理参数
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

//   // 配置纹理图像
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

//   // 将0号纹理传递给着色器
//   gl.uniform1i(u_Sampler, 0);

//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
// }

// let VSHADER_SOURCE =
//   `
//   attribute vec4 a_Position;
//   attribute vec2 a_TexCoord;
//   varying vec2 v_TexCoord;
//   void main(){
//     gl_Position = a_Position;
//     v_TexCoord = a_TexCoord;
//   }
//   `;
// let FSHADER_SOURCE =
//   `
//   precision mediump float;
//   uniform sampler2D u_Sampler;
//   varying vec2 v_TexCoord;
//   void main(){
//     gl_FragColor = texture2D(u_Sampler,v_TexCoord);
//   }
//   `;
// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('着色器初始化失败');
//     return;
//   }
//   let n = initVertexBuffer(gl);
//   if (!initTextures(gl, n)) {
//     console.log('纹理映射失败');
//     return;
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
// }
// function initVertexBuffer(gl) {
//   let verticesTexCoords = new Float32Array([
//     -0.5, 0.5, 0.0, 1.0,
//     -0.5, -0.5, 0.0, 0.0,
//     0.5, 0.5, 1.0, 1.0,
//     0.5, -0.5, 1.0, 0.0
//   ]);
//   let n = 4;
//   let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
//   let vertexTexCoordBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
//   gl.enableVertexAttribArray(a_Position);
//   gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
//   gl.enableVertexAttribArray(a_TexCoord);
//   return n;
// }
// function initTextures(gl, n) {
//   //1.创建纹理对象
//   let texture = gl.createTexture();
//   //2.获取取样器变量d
//   let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
//   //3.创建image变量 → 注册图像加载事件响应函数 → 加载图像
//   let image = new Image();
//   image.onload = function () {
//     loadTexture(gl, n, texture, u_Sampler, image);
//   };
//   image.src = '../img/yellowflower.jpg';
//   return true;
// }
// function loadTexture(gl, n, texture, u_Sampler, image) {
//   // 1.对纹理进行y轴反转
//   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
//   // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
//   // 2.开启0号纹理单元
//   gl.activeTexture(gl.TEXTURE0);
//   // 3.绑定纹理对象
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   // 4.配置纹理参数
//   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
//   // 5.配置纹理图像
//   // gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
//   // gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,gl.LUMINANCE,gl.UNSIGNED_BYTE,image);
//   gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE_ALPHA,gl.LUMINANCE_ALPHA,gl.UNSIGNED_BYTE,image);
//   // 6.将0号纹理传递给着色器
//   gl.uniform1i(u_Sampler, 0);

//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
// }


let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main(){
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
  `;
let FSHADER_SOURCE =
  `
  precision mediump float;
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main(){
    gl_FragColor = texture2D(u_Sampler,v_TexCoord);
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
  if (!initTexture(gl,n)) {
    console.log('纹理映射失败');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}
function initVertexBuffer(gl) {
  // let verticesTexCoords = new Float32Array([
  //   -0.5, 0.5, 0.0, 1.0,
  //   -0.5, -0.5, 0.0, 0.0,
  //   0.5, 0.5, 1.0, 1.0,
  //   0.5, -0.5, 1.0, 0.0
  // ]);
  let verticesTexCoords = new Float32Array([
    -0.5, 0.5, -0.3, 1.7,
    -0.5, -0.5, -0.3, -0.2,
    0.5, 0.5, 1.7, 1.7,
    0.5, -0.5, 1.7, -0.2
  ]);
  let n = 4;
  let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  let vertexTexCoordBuffer = gl.createBuffer();
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);
  return n;

}
function initTexture(gl, n) {
  // 1. 创建纹理对象
  let texture = gl.createTexture();
  // 2. 获取uniform变量u_Sampler位置
  let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  // 3. 创建image，注册图像加载事件响应函数，加载图像
  let image = new Image();
  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  }
  image.src = '../img/tobydog.jpg';
  return true;
}
function loadTexture(gl, n, texture, u_Sampler, image) { 
 // 1. 反转y轴
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
 // 2. 激活相应的纹理单元
  gl.activeTexture(gl.TEXTURE0);
 // 3. 绑定纹理单元与纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);
 // 4. 配置纹理属性：决定计算纹理坐标内插值的方式
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
 // 5. 配置纹理图像：决定绘制的图像格式
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
 // 6. 传递uniform值到着色器
  gl.uniform1i(u_Sampler, 0);
 // 7. 清空画布 
  gl.clear(gl.COLOR_BUFFER_BIT);
 // 8. 开始绘制
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}