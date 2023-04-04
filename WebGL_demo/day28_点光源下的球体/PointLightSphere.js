let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;

  uniform mat4 u_MvpMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;

  uniform vec3 u_AmbientLight;
  uniform vec3 u_LightColor;
  uniform vec3 u_LightPosition;

  varying vec4 v_Color;
  void main(){
    vec4 color = vec4(1.0,1.0,1.0,1.0);
    gl_Position = u_MvpMatrix * a_Position;

    vec3 normal = vec3(u_NormalMatrix * a_Normal);
    vec4 vertexPosition = u_ModelMatrix * a_Position;
    vec3 lightDirection = normalize(u_LightPosition - vertexPosition.xyz);
    float nDotL = max(dot(lightDirection,normal),0.0);
    vec3 diffuse = u_LightColor * color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * color.rgb;
    v_Color = vec4( diffuse + ambient ,1.0);
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

  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  let u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  let u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');

  let mvpMatrix = new Matrix4();
  let modelMatrix = new Matrix4();
  let normalMatrix = new Matrix4();

  modelMatrix.setRotate(0, 0, 1, 0);
  mvpMatrix.setPerspective(
    30, 1, 1, 100
  ).lookAt(
    0, 0, 6, 0, 0, 0, 0, 1, 0
  ).multiply(modelMatrix);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);
  gl.uniform3f(u_LightPosition, 5.0, 8.0, 7.0);

  let n = initVertexBuffers(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

}

function initVertexBuffers(gl) {
  let SPHERE_DIV = 100;
  let i, ai, si, ci;
  let j, aj, sj, cj;
  let p1, p2;

  let positions = [];  // 顶点坐标data
  let indices = []; // 索引坐标

  // 计算顶点坐标 13*13 = 169个顶点
  for (j = 0; j <= SPHERE_DIV; j++){
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++){
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj); // X
      positions.push(cj);      // Y
      positions.push(ci * sj); // Z
    }
  }

  // 计算顶点索引
  for (j = 0; j < SPHERE_DIV; j++){
    for (i = 0; i < SPHERE_DIV; i++){
      p1 = j * (SPHERE_DIV + 1) + i;
      p2 = p1 + (SPHERE_DIV + 1);
      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }
  
  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;
  
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}
function initArrayBuffer(gl, attribute, data, type, num) {
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
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}
