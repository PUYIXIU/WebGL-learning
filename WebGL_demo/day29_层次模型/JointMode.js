// let VSHADER_SOURCE = `
//   attribute vec4 a_Position;
//   attribute vec4 a_Normal;
//   uniform mat4 u_MvpMatrix;
//   uniform mat4 u_NormalMatrix;
//   varying vec4 v_Color;
//   void main(){
//     gl_Position = u_MvpMatrix * a_Position;

//     vec3 lightDirection = normalize(vec3(0.0,0.5,0.7));
//     vec4 color =  vec4( 0.0, 0.4, 0.4, 1.0);
//     vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);
//     float nDotL = max(dot(normal,lightDirection ),0.0);
//     v_Color = vec4(color.rgb * nDotL + vec3(0.3),color.a);
//   }
// `;

// let FSHADER_SOURCE = `
//   #ifdef GL_ES
//     precision mediump float;
//   #endif
//   varying vec4 v_Color;
//   void main(){
//     gl_FragColor = v_Color;
//   }
// `;

// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas);
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('failed to init shaders');
//     return;
//   }
  
//   let n = initVertexBuffers(gl);  //set the vertex information
  
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.enable(gl.DEPTH_TEST);

//   let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
//   let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

//   let vpMatrix = new Matrix4();
//   vpMatrix.setPerspective(
//     50, 1.0, 1.0, 100.0
//   ).lookAt(
//     20, 10, 30, 0, 0, 0, 0, 1, 0
//   );
//   document.onkeydown = function (ev) {
//     keydown(gl,ev,n,u_MvpMatrix,u_NormalMatrix,vpMatrix);
//   }
//   draw(gl,n,u_MvpMatrix,u_NormalMatrix,vpMatrix);
// }

// let ANGLE_STEP = 5.0; // the increments of rotation angle
// let arm1_angle = -90.0;
// let joint1_angle = 0.0;
// function keydown(gl, ev, n, u_MvpMatrix, u_NormalMatrix, vpMatrix) {
//   // ←→：arm1   ↑↓：arm2
//   switch (ev.keyCode) {
//     case 37: arm1_angle = (arm1_angle - ANGLE_STEP) % 360; break; //←
//     case 38: if (joint1_angle < 135.0) joint1_angle += ANGLE_STEP; break; //↑
//     case 39: arm1_angle = (arm1_angle + ANGLE_STEP) % 360; break; //→
//     case 40: if (joint1_angle > -135.0) joint1_angle -= ANGLE_STEP; break; //↓
//     default: break;
//   }
//   draw(gl,n,u_MvpMatrix,u_NormalMatrix,vpMatrix);
// }

// function initVertexBuffers(gl) {
//   var vertices = new Float32Array([
//     1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
//     1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
//     1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
//    -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
//    -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
//     1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
//   ]);

//   // Normal
//   var normals = new Float32Array([
//     0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
//     1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
//     0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
//    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
//     0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
//     0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
//   ]);

//   // Indices of the vertices
//   var indices = new Uint8Array([
//      0, 1, 2,   0, 2, 3,    // front
//      4, 5, 6,   4, 6, 7,    // right
//      8, 9,10,   8,10,11,    // up
//     12,13,14,  12,14,15,    // left
//     16,17,18,  16,18,19,    // down
//     20,21,22,  20,22,23     // back
//   ]);

//   initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
//   initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);

//   let indexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
//   return indices.length;

// }

// function initArrayBuffer(gl, attribute, data, num, type) {
//   let buffer = gl.createBuffer();
//   let a_Attribute = gl.getAttribLocation(gl.program, attribute);
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//   gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
//   gl.enableVertexAttribArray(a_Attribute);
// }

// let g_modelMatrix = new Matrix4();  // Model Matrix
// let g_mvpMatrix = new Matrix4();
// // count modelMatrix
// function draw(gl,n,u_MvpMatrix,u_NormalMatrix,vpMatrix) {
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//   // Arm1
//   let arm1Length = 10.0;
//   g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
//   g_modelMatrix.rotate(arm1_angle, 0.0, 1.0, 0.0);
//   drawBox(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix);

//   // Arm2
//   g_modelMatrix.translate(0.0, arm1Length, 0.0);
//   g_modelMatrix.rotate(joint1_angle, 0.0, 0.0, 1.0);
//   g_modelMatrix.scale(1.3, 1.0, 1.3);
//   drawBox(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix);
// }

// let g_normalMatrix = new Matrix4();
// // count mvpMatrix and normalMatrix , then draw the result
// function drawBox(gl,n,u_MvpMatrix,u_NormalMatrix,vpMatrix) {
//   g_mvpMatrix.set(
//     vpMatrix
//   ).multiply(
//     g_modelMatrix
//   );
//   gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
//   g_normalMatrix.setInverseOf(g_modelMatrix);
//   g_normalMatrix.transpose();
//   gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
//   gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
// }

let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec4 color = vec4(0.0, 0.7, 0.7, 1.0);
    vec3 LightDirection = vec3(0.0, 0.5, 0.7);  // Light Direction
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    float nDotL = max(dot(normal,LightDirection),0.0);
    v_Color = vec4(color.rgb * nDotL + vec3(0.2), 1.0);
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


let ANGLE_STEP = 3.0; // rotate speed
let arm1_angle = 0.0; // arm1 rotate y_aixs
let joint1_angle = 90.0; // joint1 rotate z_aixs
let joint_limit = 135.0; // joint1 rotate limit
let g_mvpMatrix = new Matrix4(); // input mvpMatrix
let g_modelMatrix = new Matrix4(); // model Matrix use for count mvpMatrix
let g_normalMatrix = new Matrix4(); // input normalMatrix
let arm1_length = 10.0;
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  let n = initVertexBuffers(gl);

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  let vpMatrix = new Matrix4();
  vpMatrix.setPerspective(
    50, 1, 1, 100
  ).lookAt(
    20, 10, 30, 0, 0, 0, 0, 1, 0
  );

  document.onkeydown = function (ev) {
    keydown(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix, ev);
  }
  draw(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix);
}

function keydown(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix, ev) {
  switch (ev.keyCode) {
    case 37: //← arm1 clockwise rotation
      arm1_angle = (arm1_angle - ANGLE_STEP) % 360;
      break;
    case 38: //↑ joint1 open
      if (joint1_angle < joint_limit) {
        joint1_angle += ANGLE_STEP;
      }
      break; 
    case 39: //→ arm1 anticlockwise rotation
      arm1_angle = (arm1_angle + ANGLE_STEP) % 360;
      break;
    case 40: //↓ joint1 close
      if (joint1_angle > -joint_limit) {
        joint1_angle -= ANGLE_STEP;
      }
      break;
    default: break;
  }
  draw(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix);
}

function draw(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  g_modelMatrix.setTranslate(0, -12, 0);
  g_modelMatrix.rotate(arm1_angle, 0, 1, 0);
  drawBox(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix);

  g_modelMatrix.translate(0, arm1_length, 0);
  g_modelMatrix.rotate(joint1_angle, 0, 0, 1);
  g_modelMatrix.scale(1.3, 1.0, 1.3);
  drawBox(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix);
}

function drawBox(gl, n, u_MvpMatrix, u_NormalMatrix, vpMatrix) {
  g_mvpMatrix.set(vpMatrix).multiply(g_modelMatrix);
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
    1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
    1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
   -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
   -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
    1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
  initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);

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
