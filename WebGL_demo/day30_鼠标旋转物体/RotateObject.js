let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  uniform mat4 u_MvpMatrix;
  varying vec2 v_TexCoord;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }
`;

let FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main(){
    gl_FragColor = texture2D(u_Sampler,v_TexCoord);
  }
`;

function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to init shaders');
    return;
  }
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  let currentAngle = [0, 0];
  let vpMatrix = new Matrix4();
  vpMatrix.setPerspective(
    30, 1, 1, 100
  ).lookAt(
    3, 7, 7, 0, 0, 0, 0, 1, 0
  );
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

  let n = initVertexBuffers(gl);
  initEventHandlers(canvas, currentAngle);
  initTextures(gl);

  let tick = function () {
    draw(gl, n, vpMatrix, u_MvpMatrix, currentAngle);
    requestAnimationFrame(tick);
  }
  tick();
}

function initEventHandlers(canvas,currentAngle) {
  let dragging = false;
  let lastX = 0, lastY = 0;
  canvas.onmousedown = function (ev) {
    let x = ev.x, y = ev.y;
    let rect = ev.target.getBoundingClientRect();
    if ((rect.left <= x && x < rect.right) && (rect.top <= y && y < rect.bottom)) {
      dragging = true;
    }
  }
  canvas.onmousemove = function (ev) {
    let x = ev.x, y = ev.y;
    if (dragging) {
      let factor = 100 / y;
      currentAngle[0] = currentAngle[0] + (y - lastY) * factor;
      currentAngle[1] = currentAngle[1] + (x - lastX) * factor;
    }
    lastX = x, lastY = y;
  }
  canvas.onmouseup = function (ev) {
    dragging = false;
  }
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

  var texCoords = new Float32Array([   // Texture coordinates
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v0-v1-v2-v3 front
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,    // v0-v3-v4-v5 right
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,    // v0-v5-v6-v1 up
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v1-v6-v7-v2 left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,    // v7-v4-v3-v2 down
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0     // v4-v7-v6-v5 back
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

  initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
  initArrayBuffer(gl, 'a_TexCoord', texCoords, 2, gl.FLOAT);
  
  let indexBuffeer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffeer);
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

let g_MvpMatrix = new Matrix4();
function draw(gl, n, vpMatrix, u_MvpMatrix, currentAngle) {
  g_MvpMatrix.set(vpMatrix);
  g_MvpMatrix.rotate(
    currentAngle[0], 1, 0, 0
  ).rotate(
    currentAngle[1], 0, 1, 0
  );
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initTextures(gl) {
  let texture = gl.createTexture();
  let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  let image = new Image();
  image.onload = function () {
    loadTexture(gl, texture, u_Sampler, image);
  };
  image.src = '../img/blueflower.jpg';
}

function loadTexture(gl, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
  // Activate texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Pass the texure unit 0 to u_Sampler
  gl.uniform1i(u_Sampler, 0);
}
