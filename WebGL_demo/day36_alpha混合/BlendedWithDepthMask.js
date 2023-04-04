let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec3 v_Position;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
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

let g_Eye = [3, 3, 7];
function main() { 
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  // model view perspective
  let mvpMatrix = new Matrix4();
  let projMatrix = new Matrix4();
  projMatrix.setPerspective(
    30,1,1,100
  );
  
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);

  draw(gl, u_MvpMatrix, mvpMatrix, projMatrix);
 
  window.onkeydown = function (ev) { 
    keydown(ev, gl, u_MvpMatrix, mvpMatrix, projMatrix);
  }

}

function keydown(ev, gl, u_MvpMatrix, mvpMatrix, projMatrix) { 
  switch (ev.keyCode) {
    case 37:
      g_Eye[0] -= 0.1;
      break;
    case 39:
      g_Eye[0] += 0.1;
      break;
    default:
      break;
  }
  draw(gl, u_MvpMatrix, mvpMatrix, projMatrix);
}

function draw(gl, u_MvpMatrix, mvpMatrix, projMatrix) {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mvpMatrix.set(projMatrix).lookAt(...g_Eye,0, 0, 0,0, 1, 0
  ).scale(
    0.3,0.3,0.3
  ).rotate(
    45,1,1,1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  let n_Solid = initVertexBuffer_Solid(gl);
  gl.drawElements(gl.TRIANGLES, n_Solid, gl.UNSIGNED_BYTE, 0);

  mvpMatrix.set(projMatrix).lookAt(...g_Eye,0, 0, 0,0, 1, 0
  ).scale(
    0.3,0.3,0.3
  ).rotate(
    90,1,1,1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  n_Solid = initVertexBuffer_Solid(gl);
  gl.drawElements(gl.TRIANGLES, n_Solid, gl.UNSIGNED_BYTE, 0);

  mvpMatrix.set(projMatrix).lookAt(...g_Eye,0, 0, 0,0, 1, 0
    ).scale(
      0.3,0.3,0.3
    ).rotate(
      -45,1,1,1
    );
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    n_Solid = initVertexBuffer_Solid(gl,1);
    gl.drawElements(gl.TRIANGLES, n_Solid, gl.UNSIGNED_BYTE, 0);

  gl.depthMask(false);

  mvpMatrix.set(
    projMatrix
  ).lookAt(
    ...g_Eye,
    0, 0, 0,
    0, 1, 0
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  let n_Blend = initVertexBuffer_Blend(gl);
  gl.drawElements(gl.TRIANGLES, n_Blend, gl.UNSIGNED_BYTE, 0);
  
  mvpMatrix.set(
    projMatrix
  ).lookAt(
    ...g_Eye,
    0, 0, 0,
    0, 1, 0
  ).scale(
    1,1,1
  ).rotate(
    30,1,1,1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.blendFunc(gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);
  n_Blend = initVertexBuffer_Blend(gl);
  gl.drawElements(gl.TRIANGLES, n_Blend, gl.UNSIGNED_BYTE, 0);
  mvpMatrix.set(
    projMatrix
  ).lookAt(
    ...g_Eye,
    0, 0, 0,
    0, 1, 0
  ).scale(
    1,1,1
  ).rotate(
    -30,1,1,1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.blendFunc(gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);
  n_Blend = initVertexBuffer_Blend(gl);
  gl.drawElements(gl.TRIANGLES, n_Blend, gl.UNSIGNED_BYTE, 0);

  mvpMatrix.set(
    projMatrix
  ).lookAt(
    ...g_Eye,
    0, 0, 0,
    0, 1, 0
  ).scale(
    1.2,1.2,1.2
  ).rotate(
    -90,1,1,1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  n_Blend = initVertexBuffer_Blend(gl);
  gl.drawElements(gl.TRIANGLES, n_Blend, gl.UNSIGNED_BYTE, 0);

  gl.depthMask(true);
  
}

function initVertexBuffer_Solid(gl) {
  let vertices = new Float32Array([
    // font-back-left-right-up-down
    1, 1, 1,   -1, 1, 1,    -1, -1, 1,    1, -1, 1, //front v0-v1-v2-v3
    1, 1, -1,  -1, 1, -1,   -1, -1, -1,   1, -1, -1,//back v5-v6-v7-v4
    -1, 1, 1,  -1, -1, 1,   -1, -1, -1,  -1, 1, -1, //left v1-v2-v7-v6
    1, 1, 1,    1, -1, 1,    1, -1, -1,   1, 1, -1,//right v0-v3-v4-v5
    1, 1, 1,   -1, 1, 1,    -1, 1, -1,    1, 1, -1,//up v0-v1-v6-v5
    1, -1, 1,  -1, -1, 1,   -1, -1, -1,   1, -1, -1//down v3-v2-v7-v4
  ]);
  
  let colors = new Float32Array([
    1, 1, 0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //front
    0.4, 1.0, 1.0, 1, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, //back
    1.0, 1.0, 0.4, 1.0, 1.0, 1, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //left
    0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 1, 1.0, 0.4, 0.4, 1.0, 0.4, //right
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 1, 0.4, 1.0, 0.4, 0.4, //up
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //down
  ]);
  let indices = new Int8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // back
    8, 9,10,   8,10,11,    // left
   12,13,14,  12,14,15,    // right
   16,17,18,  16,18,19,    // up
   20,21,22,  20,22,23     // down
  ]);
  initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3);
  initArrayBuffer(gl, 'a_Color', colors, gl.FLOAT, 3);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length
}
 
function initVertexBuffer_Blend(gl) { 
  let vertices = new Float32Array([
    // font-back-left-right-up-down
    1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, //front v0-v1-v2-v3
    1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1,//back v5-v6-v7-v4
    -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, //left v1-v2-v7-v6
    1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,//right v0-v3-v4-v5
    1, 1, 1, -1, 1, 1, -1, 1, -1, 1, 1, -1,//up v0-v1-v6-v5
    1, -1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1//down v3-v2-v7-v4
  ]);
  let colors = new Float32Array([
    0.4, 1.0, 1.0, 0.2,   0.1, 0.4, 1.0,0.2,   0.4, 0.8, 1.0,0.2,   0.4, 0.4, 1.0,0.2, //front
    0.4, 1.0, 1.0, 0.2,   1.0, 1.0, 1.0,0.2,   0.3, 1.0, 1.0,0.2,   0.4, 1.0, 1.0,0.2, //back
    1.0, 1.0, 0.5, 0.2,   1.0, 1.0, 0.4,0.2,   1.0, 1.0, 1.0,0.2,   1.0, 1.0, 0.4,0.2, //left
    0.1, 1.0, 0.4, 0.2,   1.0, 1.0, 0.4,0.2,   0.4, 1.0, 0.4,0.2,   0.4, 1.0, 0.4,0.2, //right
    1.0, 0.1, 0.0, 0.2,   1.0, 0.4, 1.0,0.2,   1.0, 0.4, 0.4,0.2,   1.0, 0.4, 0.4,0.2, //up
    1.0, 0.2, 1.0, 0.2,   1.0, 0.5, 1.0,0.2,   1.0, 0.2, 1.0,0.2,   1.0, 1.0, 1.0,0.2, //down
  ]);
  let indices = new Int8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // back
    8, 9,10,   8,10,11,    // left
   12,13,14,  12,14,15,    // right
   16,17,18,  16,18,19,    // up
   20,21,22,  20,22,23     // down
  ]);
  initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3);
  initArrayBuffer(gl, 'a_Color', colors, gl.FLOAT, 4);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length
}

function initArrayBuffer(gl, attribute, data, type, num) { 
  let buffer = gl.createBuffer();
  let a_Attribute = gl.getAttribLocation(gl.program, attribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_Attribute);
}

