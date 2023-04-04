// function main() {
//   // 获取<canvas>元素
//   var canvas = document.getElementById('webgl');
  
//   // 获取WebGL绘图上下文
//   var gl = getWebGLContext(canvas);
//   if (!gl) {
//     console.log("Congratulate! You meet a bug!")
//     return;
//   }

//   // 指定清空<canvas>颜色
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);

//   // 清空<canvas>
//   gl.clear(gl.COLOR_BUFFER_BIT);
// }

// function main() {
//   var canvas = document.getElementById('webgl');
//   var gl = getWebGLContext(canvas);
//   if (!gl) {
//     return;
//   }
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
// }

// function main() {
//   let canvas = document.getElementById('webgl')
//   let gl = getWebGLContext(canvas);
//   if (!gl) { return; }
//   gl.clearColor(10.0, 0.0, 25.0, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT);
// }

// function main() {
//   let canvas = document.getElementById('webgl');
//   let ctx = canvas.getContext('2d');
//   ctx.fillStyle = 'rgba(0,0,255,1.0)';
//   ctx.fillRect(120, 10, 150, 150);
// }

// function main() {
//   let canvas = document.getElementById('webgl');
//   let gl = getWebGLContext(canvas,true);
//   if (!gl) { return; }
//   gl.clearColor(0.6, 0.3, 0.3, 0.7);
//   gl.clearDepth(0.8)
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.clear(gl.DEPTH_BUFFER_BIT);

//   // gl.clear(gl.STENCIL_BUFFER_BIT);
// }

function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  gl.clearColor(0.6, 0.3, 0.3, 0.7);
  gl.clear(gl.COLOR_BUFFER_BIT);
}