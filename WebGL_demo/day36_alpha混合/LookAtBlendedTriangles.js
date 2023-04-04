let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ProjMatrix;
  uniform mat4 u_ViewMatrix;
  varying vec4 v_Color;
  void main(){
    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
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
let g_eye = [0.2,0.25,0.2];
function main() { 
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { 
    console.log('failed to init shaders');
    return;
  }
  let n = initVertexBuffers(gl);
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.BLEND);
  // 加深饱和度 颜色取反 加深亮度 加深透明度
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //加深透明度
  // gl.blendFunc(gl.SRC_COLOR, gl.ONE); //加深颜色饱和度
  // gl.blendFunc(gl.SRC_COLOR, gl.SRC_ALPHA); //加深颜色亮度
  // gl.blendFunc(gl.ONE_MINUS_SRC_COLOR, gl.ONE); //加深颜色亮度
  

  // gl.blendFunc(gl.ZERO, gl.ZERO); //   
  // gl.blendFunc(gl.ONE_MINUS_SRC_COLOR, gl.SRC_ALPHA); //   
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); //   
  
  let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  let projMatrix = new Matrix4();
  let viewMatrix = new Matrix4();
  projMatrix.setOrtho(
    -1, 1, -1, 1, 0, 2
  );
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  draw(gl, n, u_ViewMatrix, viewMatrix);
  window.onkeydown = function (ev) { 
    keydown(gl, n,u_ViewMatrix, viewMatrix, ev);
  }
}

function initVertexBuffers(gl) { 
  var verticesColors = new Float32Array([
    // Vertex coordinates and color(RGBA)
    0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,  0.4, // The back green one
   -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,  0.4,
    0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,  0.4, 
   
    0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,  0.4, // The middle yerrow one
   -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,  0.4,
    0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,  0.4, 

    0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  0.4,  // The front blue one 
   -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,  0.4,
    0.5, -0.5,   0.0,  1.0,  0.4,  0.4,  0.4, 
  ]);
  let n = 9;
  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false,  7*FSIZE,0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 7 * FSIZE, 3 * FSIZE);
  gl.enableVertexAttribArray(a_Color);
  return n;
}

function keydown(gl, n, u_ViewMatrix, viewMatrix,ev) { 
  switch (ev.keyCode) { 
    case 37:
      g_eye[0] -= 0.01;
      break;
    case 39:
      g_eye[0] += 0.01;
      break;
    default:
      break;
  }
  draw(gl, n, u_ViewMatrix, viewMatrix)
}

function draw(gl, n, u_ViewMatrix, viewMatrix) { 
  viewMatrix.setLookAt(
    ...g_eye,

    0, 0, 0,
    0, 1, 0
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}