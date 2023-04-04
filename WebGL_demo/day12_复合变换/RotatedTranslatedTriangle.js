let ANGEL = 60.0;
let Tx = 0.5, Ty = 0.0, Tz = 0.0;

let VSHADER_SOURCE =
  `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main(){
    gl_Position = a_Position * u_ModelMatrix ;
    gl_Position =  u_ModelMatrix *a_Position ;
  }
  `;
let FSHADER_SOURCE =
  `
  void main(){
    gl_FragColor = vec4(0.0,1.0,0.0,0.8);
  }
  `;

function initVertexBuffer(gl) {
  let vertices = new Float32Array([
    0.0, 0.2, -0.25, -0.25, 0.25, -0.25
  ]);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length / 2;
}

function main() { 
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('着色器初始化失败');
    return;
  }
  let n = initVertexBuffer(gl);

  let modelMatrix = new Matrix4();
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // modelMatrix.setRotate(ANGEL, 0, 0, 1);
  // modelMatrix.translate(Tx, Ty, Tz);

  modelMatrix.setTranslate(Tx, Ty, Tz);
  modelMatrix.rotate(ANGEL, 0, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}