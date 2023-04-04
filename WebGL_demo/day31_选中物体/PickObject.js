let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  uniform bool u_Clicked;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    if(u_Clicked){
      v_Color = a_Color;
    }else{
      v_Color = vec4(1.0,0.0,0.0,1.0);
    }
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
 
let ANGLE_STEP = 20.0;
function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return gl;
  }
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  let n = initVertexBuffers(gl);
  let currentAngle = 0;
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');
  let vpMatrix = new Matrix4().setPerspective(
    30, 1, 1, 100
  ).lookAt(
    0, 0, 7, 0, 0, 0, 0, 1, 0
  );
  gl.uniform1i(u_Clicked, 1);
  canvas.onmousedown = function (ev) {
    let x = ev.x, y = ev.y;
    let rect = ev.target.getBoundingClientRect();
    if ((rect.left <= x && x < rect.right) && (rect.top <= y && y < rect.bottom)) {
      let x_in_canvas = x - rect.left;
      let y_in_canvas = rect.bottom - y;
      let picked = check(gl, n,currentAngle, vpMatrix, u_MvpMatrix,  u_Clicked,x_in_canvas, y_in_canvas,);
      if (picked) {
        alert('The cube is selected!');
      }
    }
  }
  
  let tick = function () {
    currentAngle = animation(currentAngle);
    draw(gl, n, vpMatrix,currentAngle,  u_MvpMatrix);
    requestAnimationFrame(tick);
  }
  tick();
}

function check(gl,n,currentAngle,vpMatrix,u_MvpMatrix,u_Clicked,x,y) {

  gl.uniform1i(u_Clicked, 0);
  draw(gl, n, vpMatrix, currentAngle, u_MvpMatrix);

  let picked = false;
  let pixels = new Uint8Array(8);
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  if (pixels[0] === 255) {
    picked = true;
  }

  gl.uniform1i(u_Clicked, 1);
  draw(gl, n, vpMatrix, currentAngle,  u_MvpMatrix);

  return picked;
}

let g_last = Date.now();
function animation(curretnAngle) {
  let g_now = Date.now();
  let elapse = g_now - g_last;
  g_last = g_now;
  return (curretnAngle + elapse * ANGLE_STEP / 1000) % 360;
}

let g_MvpMatrix = new Matrix4();
function draw(gl, n, vpMatrix, currentAngle, u_MvpMatrix) {
  g_MvpMatrix.set(
    vpMatrix
  ).rotate(
    currentAngle, 1, 1, 1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  var colors = new Float32Array([   // Colors
    0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
    0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
    0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
    0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
    0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
    0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
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

  // Write vertex information to buffer object
  if (!initArrayBuffer(gl, vertices, gl.FLOAT, 3, 'a_Position')) return -1; // Coordinate Information
  if (!initArrayBuffer(gl, colors, gl.FLOAT, 3, 'a_Color')) return -1;      // Color Information

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }
  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
function initArrayBuffer (gl, data, type, num, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment to a_attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}