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
    gl_FragColor = vec4(0.0,1.0,0.0,0.5);
  }
  `;
function initVertexBuffer(gl) {

  let verticesSizes = new Float32Array([
    0.0, 0.5, 10.0, // 第一个点
    -0.5, -0.5, 20.0, // 第二个点
    0.5, -0.5, 30.0, // 第三个点
  ])  


  let vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  let sizes = new Float32Array([
    10.0, 20.0, 30.0
  ]);
  let vertexBuffer = gl.createBuffer();
  let sizeBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);
  
  return sizes.length
}
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('初始化着色器失败');
    return;
  }
  let n = initVertexBuffer(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, n);
}