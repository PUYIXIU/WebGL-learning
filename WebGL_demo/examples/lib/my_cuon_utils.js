function initShaders(gl, vshader, fshader) {
  let program = createProgram(...arguments);
  if (!program) {
    console.log('Failed to init shader');
    return false;
  }
  // 7. 使用着色器
  gl.useProgram(program);
  gl.program = program;
  return true;
}

function createProgram(gl, vshader, fshader) {
  
  // 4. 创建程序对象
  let program = gl.createProgram();

  // 5. 添加着色器
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  let fragmentShader = loadShader(gl, gk.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    console.log('Failed to load shader');
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 6. 连接着色器
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }
  return program;
}

function loadShader(gl, type, source) {
  // 1. 创建着色器
  let shader = gl.createShader(type);

  // 2. 附着源码
  gl.shaderSource(shader, source);

  // 3. 编译源码
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}