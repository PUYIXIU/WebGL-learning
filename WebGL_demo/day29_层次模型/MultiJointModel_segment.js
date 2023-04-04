let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec4 color = vec4(0.0,0.7,0.7,1.0);
    vec3 lightDirection = vec3(0.0,0.5,0.7);
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    float nDotL = max(dot(normal,lightDirection),0.0);
    v_Color = vec4(color.rgb*nDotL+vec3(0.2),1.0);
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

// data for count Model Matrix
let ANGLE_STEP = 3.0;
let joint1_limit = 135.0;
let joint3_limit = 60.0;
let g_arm1Angle = 90.0;
let g_joint1Angle = 45.0;
let g_joint2Angle = 0.0;
let g_joint3Angle = 0.0;

// segments' size
let baseHeight = 2.0;
let arm1Length = 10.0;
let arm2Length = 10.0;
let palmLength = 2.0;

// data for segment buffer
let g_baseBuffer = null;
let g_arm1Buffer = null;
let g_arm2Buffer = null;
let g_palmBuffer = null;
let g_fingerBuffer = null;

// temp matrix for count
let g_ModelMatrix = new Matrix4();
let g_MvpMatrix = new Matrix4();
let g_NormalMatrix = new Matrix4();
let g_matrixStack = [];
function pushMatrix(m) {
  let m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}
function popMatrix() {
  return g_matrixStack.pop();
}


function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // set the vertex information
  let n = initVertexBuffers(gl);
  let vpMatrix = new Matrix4();
  vpMatrix.setPerspective(
    50, 1, 1, 100
  ).lookAt(
    20, 10, 30, 0, 0, 0, 0, 1, 0
  );

  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  document.onkeydown = function (ev) {
    keydown(gl, ev, n, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
  }
  draw(gl, n, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}

function keydown(gl, ev, n, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
  switch (ev.keyCode) {
    case 37: //← g_arm1Angle negative rotate
      g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
      break;
    case 40: //↑ g_joint1Angle position rotate joint1_limit
      if ( g_joint1Angle < joint1_limit) {
        g_joint1Angle += ANGLE_STEP;
      }
      break;
    case 39: //→ g_arm1Angle positive rotate
      g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
      break;
    case 38: //↓ g_joint1Angle negative rotate -joint1_limit
      if (g_joint1Angle > -joint1_limit) {
        g_joint1Angle -= ANGLE_STEP;
      }
      break;
    case 67: //c g_joint3Angle negative rotate -joint3_limit
      if (g_joint3Angle > -joint3_limit) {
        g_joint3Angle -= ANGLE_STEP;
      }
      break;
    case 86: //v g_joint3Angle positive rotate joint3_limit
      if (g_joint3Angle < joint3_limit) {
        g_joint3Angle += ANGLE_STEP;
      }
      break;
    case 88: //x g_joint2Angle position rotate
      g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
      break;
    case 90: //z g_joint2Angle negative rotate
      g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
      break;
  }
  draw(gl, n, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}

function draw(gl, n, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  g_ModelMatrix.setTranslate(0.0, -12.0, 0.0);
  drawSegment(gl, n, g_baseBuffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);

  g_ModelMatrix.translate(
    0.0, baseHeight, 0.0
  ).rotate(
    g_arm1Angle, 0, 1, 0
  );
  drawSegment(gl, n, g_arm1Buffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);

  g_ModelMatrix.translate(
    0.0, arm1Length, 0.0
  ).rotate(
    g_joint1Angle, 0, 0, 1
  );
  drawSegment(gl, n, g_arm2Buffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);

  g_ModelMatrix.translate(
    0.0, arm2Length, 0.0
  ).rotate(
    g_joint2Angle, 0, 1, 0
  );
  drawSegment(gl, n, g_palmBuffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);

  g_ModelMatrix.translate(
    0.0, palmLength, 0.0
  );
  pushMatrix(g_ModelMatrix);
  g_ModelMatrix.translate(
    0.0, 0.0, 2.0
  ).rotate(
    g_joint3Angle, 1, 0, 0
  );
  drawSegment(gl, n, g_fingerBuffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
  
  g_ModelMatrix = popMatrix();
  g_ModelMatrix.translate(
    0.0, 0.0, -2.0
  ).rotate(
    -g_joint3Angle, 1, 0, 0
  );
  drawSegment(gl, n, g_fingerBuffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
  
}

function drawSegment(gl, n, buffer, vpMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
  // write segment's data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);  
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT,false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  g_MvpMatrix.set(vpMatrix).multiply(g_ModelMatrix);
  g_NormalMatrix.setInverseOf(g_ModelMatrix);
  g_NormalMatrix.transpose();

  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_NormalMatrix.elements);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  var vertices_base = new Float32Array([ // Base(10x2x10)
    5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0, 5.0, 0.0, 5.0, // v0-v1-v2-v3 front
    5.0, 2.0, 5.0, 5.0, 0.0, 5.0, 5.0, 0.0, -5.0, 5.0, 2.0, -5.0, // v0-v3-v4-v5 right
    5.0, 2.0, 5.0, 5.0, 2.0, -5.0, -5.0, 2.0, -5.0, -5.0, 2.0, 5.0, // v0-v5-v6-v1 up
    -5.0, 2.0, 5.0, -5.0, 2.0, -5.0, -5.0, 0.0, -5.0, -5.0, 0.0, 5.0, // v1-v6-v7-v2 left
    -5.0, 0.0, -5.0, 5.0, 0.0, -5.0, 5.0, 0.0, 5.0, -5.0, 0.0, 5.0, // v7-v4-v3-v2 down
    5.0, 0.0, -5.0, -5.0, 0.0, -5.0, -5.0, 2.0, -5.0, 5.0, 2.0, -5.0  // v4-v7-v6-v5 back
  ]);
  var vertices_arm1 = new Float32Array([  // Arm1(3x10x3)
    1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, // v0-v1-v2-v3 front
    1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5, // v0-v3-v4-v5 right
    1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
    -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
    -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
    1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5  // v4-v7-v6-v5 back
  ]);
  var vertices_arm2 = new Float32Array([  // Arm2(4x10x4)
    2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0, 0.0, 2.0, 2.0, 0.0, 2.0, // v0-v1-v2-v3 front
    2.0, 10.0, 2.0, 2.0, 0.0, 2.0, 2.0, 0.0, -2.0, 2.0, 10.0, -2.0, // v0-v3-v4-v5 right
    2.0, 10.0, 2.0, 2.0, 10.0, -2.0, -2.0, 10.0, -2.0, -2.0, 10.0, 2.0, // v0-v5-v6-v1 up
    -2.0, 10.0, 2.0, -2.0, 10.0, -2.0, -2.0, 0.0, -2.0, -2.0, 0.0, 2.0, // v1-v6-v7-v2 left
    -2.0, 0.0, -2.0, 2.0, 0.0, -2.0, 2.0, 0.0, 2.0, -2.0, 0.0, 2.0, // v7-v4-v3-v2 down
    2.0, 0.0, -2.0, -2.0, 0.0, -2.0, -2.0, 10.0, -2.0, 2.0, 10.0, -2.0  // v4-v7-v6-v5 back
  ]);
  var vertices_palm = new Float32Array([  // Palm(2x2x6)
    1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0, 1.0, 0.0, 3.0, // v0-v1-v2-v3 front
    1.0, 2.0, 3.0, 1.0, 0.0, 3.0, 1.0, 0.0, -3.0, 1.0, 2.0, -3.0, // v0-v3-v4-v5 right
    1.0, 2.0, 3.0, 1.0, 2.0, -3.0, -1.0, 2.0, -3.0, -1.0, 2.0, 3.0, // v0-v5-v6-v1 up
    -1.0, 2.0, 3.0, -1.0, 2.0, -3.0, -1.0, 0.0, -3.0, -1.0, 0.0, 3.0, // v1-v6-v7-v2 left
    -1.0, 0.0, -3.0, 1.0, 0.0, -3.0, 1.0, 0.0, 3.0, -1.0, 0.0, 3.0, // v7-v4-v3-v2 down
    1.0, 0.0, -3.0, -1.0, 0.0, -3.0, -1.0, 2.0, -3.0, 1.0, 2.0, -3.0  // v4-v7-v6-v5 back
  ]);
  var vertices_finger = new Float32Array([  // Fingers(1x2x1)
    0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 2.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 2.0, -0.5, // v0-v3-v4-v5 right
    0.5, 2.0, 0.5, 0.5, 2.0, -0.5, -0.5, 2.0, -0.5, -0.5, 2.0, 0.5, // v0-v5-v6-v1 up
    -0.5, 2.0, 0.5, -0.5, 2.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
    -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 2.0, -0.5, 0.5, 2.0, -0.5  // v4-v7-v6-v5 back
  ]);
// Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
  ]);
// Indices of the vertices
  var indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);

  // Write coords to buffer, but don't assign to attribute variables
  // Just like regist
  g_baseBuffer = initArrayBufferForLaterUse(gl, vertices_base, 3, gl.FLOAT);
  g_arm1Buffer = initArrayBufferForLaterUse(gl, vertices_arm1, 3, gl.FLOAT);
  g_arm2Buffer = initArrayBufferForLaterUse(gl, vertices_arm2, 3, gl.FLOAT);
  g_palmBuffer = initArrayBufferForLaterUse(gl, vertices_palm, 3, gl.FLOAT);
  g_fingerBuffer = initArrayBufferForLaterUse(gl, vertices_finger, 3, gl.FLOAT);

  // write normals to a buffer ,assign it to a_Normal
  initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);

  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}

// regist buffer
function initArrayBufferForLaterUse(gl, data, num, type) { 
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // set the num and type in advance
  // instead of use vertexAttribPointer 
  buffer.num = num;
  buffer.type = type;
  return buffer;
}

// regist buffer and assign 
function initArrayBuffer(gl, attribute, data, num, type) {
  let buffer = gl.createBuffer();
  let a_Attribute = gl.getAttribLocation(gl.program, attribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_Attribute);
}