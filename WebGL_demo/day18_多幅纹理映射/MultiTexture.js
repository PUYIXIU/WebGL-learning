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
//   uniform sampler2D u_Sampler0;
//   uniform sampler2D u_Sampler1;
//   varying vec2 v_TexCoord;
//   void main(){
//     vec4 color0 = texture2D(u_Sampler0,v_TexCoord);
//     vec4 color1 = texture2D(u_Sampler1,v_TexCoord);
//     gl_FragColor = color0 * color1;
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
//   if (!initTexture(gl, n)) {
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
//   let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
//   gl.enableVertexAttribArray(a_Position);
//   gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
//   gl.enableVertexAttribArray(a_TexCoord);
//   return n;
// }
// function initTexture(gl, n) {
//   let texture0 = gl.createTexture();
//   let texture1 = gl.createTexture();
//   let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
//   let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

//   let image0 = new Image();
//   let image1 = new Image();

//   image0.onload = function () {
//     loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
//   }
//   image1.onload = function () {
//     loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
//   }
//   image0.src = '../img/tobydog.jpg';
//   image1.src = '../img/blueflower.jpg';
//   return true;
// }
// let g_texUnit0 = false;
// let g_texUnit1 = false;
// function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
//   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
//   if (texUnit === 0) {
//     gl.activeTexture(gl.TEXTURE0);
//     g_texUnit0 = true;
//   } else {
//     gl.activeTexture(gl.TEXTURE1);
//     g_texUnit1 = true;
//   }
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//   gl.uniform1i(u_Sampler, texUnit);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   if (g_texUnit0 && g_texUnit1) {
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
//   }
// }

let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord0;
  attribute vec2 a_TexCoord1;
  varying vec2 v_TexCoord0;
  varying vec2 v_TexCoord1;
  void main(){
    gl_Position = a_Position;
    v_TexCoord0 = a_TexCoord0;
    v_TexCoord1 = a_TexCoord1;
  }
  `;
let FSHADER_SOURCE =
  `
  precision mediump float;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  varying vec2 v_TexCoord0;
  varying vec2 v_TexCoord1;
  void main(){
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord0);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord1);
    gl_FragColor = color0 * color1;
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
  if (!initTexture(gl, n)) {
    console.log('纹理映射失败');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}
function initVertexBuffer(gl) {
  let verticesTexCoords = new Float32Array([
    -1, 1, 0.0, 1.0, -0.3, 1.7,
    -1, -1, 0.0, 0.0, -0.3, -0.2,
    1, 1, 1.0, 1.0, 1.7, 1.7,
    1, -1, 1.0, 0.0, 1.7, -0.2
  ]);
  let n = 4;
  let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  let vertexTexCoordBuffer = gl.createBuffer();
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_TexCoord0 = gl.getAttribLocation(gl.program, 'a_TexCoord0');
  let a_TexCoord1 = gl.getAttribLocation(gl.program, 'a_TexCoord1');
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_TexCoord0, 2, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord0);
  gl.vertexAttribPointer(a_TexCoord1, 2, gl.FLOAT, false, FSIZE * 6, FSIZE * 4);
  gl.enableVertexAttribArray(a_TexCoord1);
  return n;
}
function initTexture(gl, n) {
  // 1.创建纹理对象
  let texture0 = gl.createTexture();
  let texture1 = gl.createTexture();

  // 2.获取uniform类型取样器
  let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  // 3.创建image对象并注册事件
  let image0 = new Image();
  let image1 = new Image();
  image0.onload = function () {
    loadTexture(gl, n, u_Sampler0, texture0, image0, 0);
  }
  image1.onload = function () {
    loadTexture(gl, n, u_Sampler1, texture1, image1, 1);
  }
  image0.src = '../img/parasol.jpg';
  image1.src = '../img/sky_cloud.jpg';
  return true;
}
let g_texUnit0 = false;
let g_texUnit1 = false;
function loadTexture(gl, n, u_Sampler, texture, image, texUnit) {
  // 1. 反转y轴正方向
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // 2. 激活纹理单元
  if (texUnit === 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  // 3. 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 4. 配置纹理属性
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 5. 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // 6. 传递纹理单元
  gl.uniform1i(u_Sampler, texUnit);
  // 7. 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 8. 开始绘图
  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}