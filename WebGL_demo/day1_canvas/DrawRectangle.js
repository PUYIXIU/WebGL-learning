// function main() {
//   var canvas = document.getElementById('example');
//   if (!canvas) {
//     console.log('Failed to retrieve the <canvas> element');
//     return false;
//   }
//   // get the rendering context for 2DCG
//   var ctx = canvas.getContext('2d');
//   ctx.fillStyle = 'rgba(0,0,255,1.0)'; //set color
//   ctx.fillRect(120, 10, 150, 150); //fill a recrangle
// }

// function main() {
//   let canvas = document.getElementById('example');
//   if (!canvas) {
//     console.log('Failed to retrieve the <cnavas> element');
//     return false;
//   }
//   var ctx = canvas.getContext('2d');
//   ctx.fillStyle = 'rgba(0,0,255,1.0)';
//   ctx.fillRect(50, 100, 100, 50);
// }

function main() {
  let canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Sorry, seems you meet a bug');
    return false;
  }
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,255,1.0)';
  ctx.fillRect(50, 100, 100, 50);
}
