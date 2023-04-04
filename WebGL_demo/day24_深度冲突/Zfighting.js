let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_PvMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_PvMatrix * a_Position;
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
  if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  let n = initVertexBuffer(gl);
  let u_PvMatrix = gl.getUniformLocation(gl.program, 'u_PvMatrix');
  let pvMatrix = new Matrix4();
  pvMatrix.setPerspective(
    30, canvas.width / canvas.height, 1.0, 100.0
  );
  pvMatrix.lookAt(
    3,0,10, 0, 0, -6, 0, 1, 0
  );
  gl.uniformMatrix4fv(u_PvMatrix, false, pvMatrix.elements);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEAPTH_BUFFER_BIT);

  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.drawArrays(gl.TRIANGLES, 0, n/2); // draw green triangle
  gl.polygonOffset(0.001, 0.5);   // set polygon offset
  gl.drawArrays(gl.TRIANGLES, n/2, n/2); // draw blue triangle
}

function initVertexBuffer(gl) {
  let verticesColors = new Float32Array([
    // 绿色三角形
    0.0, 2.5, -5.0, 1.0, 1.0, 0.0,
    -2.5, -2.5, -5.0, 0.0, 1.0, 0.0,
    2.5, -2.5, -5.0, 0.0, 1.0, 0.0,
    
    // 蓝色三角形
    0.0, 3.0, -5.0, 0.0, 0.0, 1.0,
    -3.0, -3.0, -5.0, 0.0, 1.0, 1.0,
    3.0, -3.0, -5.0, 0.0, 1.0, 1.0,
  ]);
  let n = 6;
  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  let verticeColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
  gl.enableVertexAttribArray(a_Color);
  return n;
}