let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_ModelMatrix;
  uniform vec4 u_Eye;

  varying vec4 v_Color;
  varying float v_Dist;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
    v_Dist = gl_Position.w;
  }
`;

let FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  uniform vec3 u_FogColor;
  uniform vec2 u_FogDist;
  varying vec4 v_Color;
  varying float v_Dist;
  void main(){
    float fogFactor = clamp(
      (u_FogDist.y - v_Dist)/(u_FogDist.y - u_FogDist.x),
      0.0,
      1.0
    );
    vec3 color = mix( u_FogColor, v_Color.rbg, fogFactor);
    gl_FragColor = vec4(color,v_Color.a);
  }
`;

function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  let n = initVertexBuffers(gl);
  
  let fogColor = new Float32Array([0.137, 0.231, 0.423]);
  let fogDist = new Float32Array([55, 80]);
  let eye = new Float32Array([25, 65, 35, 1.0]);

  gl.clearColor(...fogColor, 1.0);
  gl.enable(gl.DEPTH_TEST);

  let u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
  let u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
  let u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

  gl.uniform3fv(u_FogColor, fogColor);
  gl.uniform2fv(u_FogDist, fogDist);
  gl.uniform4fv(u_Eye, eye);

  let modelMatrix = new Matrix4();
  modelMatrix.setScale(10, 10, 10);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  let mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(
    30, 1, 1, 1000
  ).lookAt(
    ...eye, 0, 2, 0, 0, 1, 0
  ).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  document.onkeydown = function (ev) {
    keydown(gl, n, ev, u_FogDist, fogDist);
  }
}

function keydown(gl, n, ev, u_FogDist, fogDist) {
  switch (ev.keyCode) {
    case 38:
      fogDist[1] += 1;
      break;
    case 40:
      if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
      break;
    default: return;
  }
  gl.uniform2fv(u_FogDist, fogDist);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([   // Vertex coordinates
    1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,    // v0-v1-v2-v3 front
    1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,    // v0-v3-v4-v5 right
    1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,    // v0-v5-v6-v1 up
    -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,    // v1-v6-v7-v2 left
    -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,    // v7-v4-v3-v2 down
    1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1     // v4-v7-v6-v5 back
  ]);
  var colors = new Float32Array([     // Colors
    0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
    0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
    1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
  ]);
  var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);
  initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
  initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type) {
  let buffer = gl.createBuffer();
  let a_Attribute = gl.getAttribLocation(gl.program, attribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_Attribute);
}