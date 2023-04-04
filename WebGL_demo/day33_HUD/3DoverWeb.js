let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute float a_Face;
  uniform mat4 u_MvpMatrix;
  uniform int u_PickedFace;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    int face = int(a_Face);
    vec3 color = ( face == u_PickedFace ) ? vec3(0.0,1.0,0.0) : a_Color.rgb;
    if(u_PickedFace == 0){
      v_Color = vec4(color,a_Face/255.0);
    }else{
      v_Color = vec4(color,a_Color.a);
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

function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to init shaders');
    return;
  }
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.DEPTH_TEST);

  let n = initVertexBuffers(gl);
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_PickedFace = gl.getUniformLocation(gl.program, 'u_PickedFace');
  let vpMatrix = new Matrix4();
  vpMatrix.setPerspective(
    30, 1, 1, 100
  ).lookAt(
    7, 0, 0, 0, 0, 0, 0, 1, 0
  );
  let currentAngle = 0;
  gl.uniform1i(u_PickedFace, -1);
  let tick = function () {
    currentAngle = animate(currentAngle);
    draw(gl, n, vpMatrix, currentAngle, u_MvpMatrix);
    requestAnimationFrame(tick);
  }
  tick();

  canvas.onmousedown = function (ev) {
    let x = ev.x, y = ev.y;
    let rect = ev.target.getBoundingClientRect();
    if ((rect.left <= x && x < rect.right) && (rect.top <= y && y < rect.bottom)) {
      let x_in_canvas = x - rect.left;
      let y_in_canvas = rect.bottom - y;
      let face = checkFace(gl, n, vpMatrix, currentAngle, u_MvpMatrix, u_PickedFace, x_in_canvas, y_in_canvas);
      gl.uniform1i(u_PickedFace, face);
      draw(gl, n, vpMatrix, currentAngle, u_MvpMatrix);
    }
  }

}

function checkFace(gl,n,vpMatrix,currentAngle,u_MvpMatrix,u_PickedFace,x,y) {
  gl.uniform1i(u_PickedFace, 0);
  draw(gl, n, vpMatrix, currentAngle, u_MvpMatrix);
  let pixels = new Uint8Array(4);
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels[3];
}

let g_MvpMatrix = new Matrix4();
function draw(gl,n,vpMatrix,currentAngle,u_MvpMatrix) {
  g_MvpMatrix.set(
    vpMatrix
  ).rotate(
    currentAngle, 1, 1, 1
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

let ANGLE_STEP = 20.0;
let g_last = Date.now();
function animate(currentAngle) {
  let g_now = Date.now();
  let elapsed = g_now - g_last;
  g_last = g_now;
  return (currentAngle + elapsed / 1000 * ANGLE_STEP) % 360;
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
  ]);

  var colors = new Float32Array([   // Colors
    0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, // v0-v1-v2-v3 front
    0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
    0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, // v0-v5-v6-v1 up
    0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61,  // v1-v6-v7-v2 left
    0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, // v7-v4-v3-v2 down
    0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, // v4-v7-v6-v5 back
  ]);

  var faces = new Uint8Array([   // Faces
    1, 1, 1, 1,     // v0-v1-v2-v3 front
    2, 2, 2, 2,     // v0-v3-v4-v5 right
    3, 3, 3, 3,     // v0-v5-v6-v1 up
    4, 4, 4, 4,     // v1-v6-v7-v2 left
    5, 5, 5, 5,     // v7-v4-v3-v2 down
    6, 6, 6, 6,     // v4-v7-v6-v5 back
  ]);

  var indices = new Uint8Array([   // Indices of the vertices
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);

  initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
  initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT);
  initArrayBuffer(gl, 'a_Face', faces, 1, gl.UNSIGNED_BYTE);
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
  return;
}