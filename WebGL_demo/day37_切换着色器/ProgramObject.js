// 1、创建着色器
let SOLID_VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color;
  void main(){
    vec3 lightDirection = vec3(0.0,0.0,1.0);
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = vec3(normalize(u_NormalMatrix * a_Normal));
    float nDotL = max(dot(normal,lightDirection),0.0);
    v_Color = vec4(nDotL*color.rbg,color.a);
  }
`;
let SOLID_FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  varying vec4 v_Color;
  void main(){
    gl_FragColor = v_Color;
  }
`;
let TEXTURE_VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  attribute vec2 a_TexCoord;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec2 v_TexCoord;
  varying float v_nDotL;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec3 lightDirection = vec3(0.0, 0.0, 1.0);
    vec4 color = vec4(1.0, 1.0 , 1.0, 1.0);
    vec3 normal = vec3(normalize(u_NormalMatrix * a_Normal));
    v_nDotL = max(dot( normal, lightDirection), 0.0);
    v_TexCoord = a_TexCoord;
  }
`;
let TEXTURE_FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  varying float v_nDotL;
  void main(){
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    gl_FragColor = vec4(v_nDotL*color.rgb,color.a);
  }
`;

function main() { 
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  let solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
  let textureProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
  if (!solidProgram || !textureProgram) {
    console.log('failed to init shader program');
    return;
  }
  solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
  solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
  solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');
  solidProgram.u_NormalMatrix = gl.getUniformLocation(solidProgram, 'u_NormalMatrix');
  
  textureProgram.a_Position = gl.getAttribLocation(textureProgram, 'a_Position');
  textureProgram.a_Normal = gl.getAttribLocation(textureProgram, 'a_Normal');
  textureProgram.a_TexCoord = gl.getAttribLocation(textureProgram, 'a_TexCoord');
  textureProgram.u_MvpMatrix = gl.getUniformLocation(textureProgram, 'u_MvpMatrix');
  textureProgram.u_NormalMatrix = gl.getUniformLocation(textureProgram, 'u_NormalMatrix');

  let o = initVertexBuffers(gl);
  let texture = initTextures(gl, textureProgram);

  let viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(
    30, canvas.width / canvas.height, 1, 100
  ).lookAt(
    0, 0, 15,
    0, 0, 0,
    0, 1, 0
  );
  
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  let currentAngle = 0.0;
  let tick = function () {
    currentAngle = animation(currentAngle);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawSolidCube(gl, solidProgram, o, -2, currentAngle, viewProjMatrix);
    drawTexCube(gl, textureProgram, o, 2, currentAngle, viewProjMatrix, texture);
    window.requestAnimationFrame(tick);
  }
  tick();
}

function initVertexBuffers(gl) {
  
  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  var normals = new Float32Array([   // Normal
     0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
  ]);

  var texCoords = new Float32Array([   // Texture coordinates
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
     0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
     1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
  ]);

  var indices = new Uint8Array([        // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  let o = new Object();
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
  return o;
}
function initTextures(gl, program) {
  let texture = gl.createTexture();
  let image = new Image();
  image.onload = function () { 
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.useProgram(program);
    gl.uniform1i(program.u_Sampler, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  image.src = '../img/sky.jpg';
  return texture;
}
function initArrayBufferForLaterUse(gl, data, num, type) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.num = num;
  buffer.type = type;
  return buffer;
}
function initElementArrayBufferForLaterUse(gl, data, type) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.type = type;
  buffer.num = data.length
  return buffer;
}
function initAttributeVariable(gl,a_attribute,buffer) { 
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function drawSolidCube(gl, program, o, x, angle, vpMatrix) {
  gl.useProgram(program);
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
  drawCube(gl, program, x, o, angle, vpMatrix);
}
function drawTexCube(gl, program, o, x, angle, vpMatrix, texture) {
  gl.useProgram(program);
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  drawCube(gl, program, x, o, angle, vpMatrix);
}

let g_MvpMatrix = new Matrix4();
let g_ModelMatrix = new Matrix4();
let g_NormalMatrix = new Matrix4();

function drawCube(gl, program, x, o, angle, vpMatrix) {
  g_ModelMatrix.setTranslate(
    x, 0, 0
  ).rotate(
    20, 1, 0, 0
  ).rotate(
    angle,0,1,0
  );
  g_MvpMatrix.set(
    vpMatrix
  ).multiply(
    g_ModelMatrix
  );
  g_NormalMatrix.setInverseOf(g_ModelMatrix).transpose();
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_MvpMatrix.elements);
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_NormalMatrix.elements);
  gl.drawElements(gl.TRIANGLES, o.indexBuffer.num,gl.UNSIGNED_BYTE, 0);
}

let ANGLE_STEP = 30.0;
let g_last = Date.now();
function animation(angle) {
  let g_now = Date.now();
  let ellapse = g_now - g_last;
  g_last = g_now;
  return (angle + ANGLE_STEP * ellapse / 1000) % 360;
}

