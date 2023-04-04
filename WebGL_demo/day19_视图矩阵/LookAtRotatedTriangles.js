let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  void main(){
    gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
    v_Color = a_Color;
  }
`;

let FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  varying vec4 v_Color;
  void main(){
    gl_FragColor = v_Color;
  }
`;

function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('failed to get context');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('failed to init vertex buffer');
    return;
  }
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!(u_ModelMatrix && u_ViewMatrix)) {
    console.log('failed to get uniform variable');
    return;
  }
  let modelMatrix = new Matrix4();
  let viewMatrix = new Matrix4();
  modelMatrix.setRotate(-10, 0, 0, 1);
  viewMatrix.setLookAt(
    0.2, 0.25,0.25,
    0, 0, 0,
    0, 1, 0
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
    // 红色三角形 最下层
    0.0, 0.5, -0.4, 1.0, 0.4, 0.4, 
    -0.5, -0.5, -0.4, 1.0, 0.3, 0.5, 
    0.5, -0.5, -0.4, 1.0, 1.0, 0.3, 
    // 绿色三角形 中间层
    0.0, -0.6, -0.2, 0.4, 1.0, 0.4, 
    -0.5, 0.5, -0.2, 0.3, 1.0, 0.5, 
    0.5, 0.5, -0.2, 1.0, 1.0, 0.3, 
    // 蓝色三角形 最上层
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, 
    -0.5, -0.5, 0.0, 0.3, 0.5, 1.0, 
    0.5, -0.5, 0.0, 0.5, 1.0, 1.0
  ]);
  let n = 9;
  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);
  return n;
}