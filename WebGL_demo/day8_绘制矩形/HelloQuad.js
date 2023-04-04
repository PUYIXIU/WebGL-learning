var VSHADER_SOURCE =
  `
    attribute vec4 a_Position;
    void main(){
      gl_Position = a_Position;
    }
  `;
var FSHADER_SOURCE =
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
    console.log('着色器初始化失败');
    return;
  }
  let n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('缓冲区初始化失败');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5,
  ]);
  let n = vertices.length / 2;
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) { 
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return n;
}