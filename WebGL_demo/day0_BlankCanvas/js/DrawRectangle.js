function main() { 
  let canvas = document.getElementById('webgl');
  if (!canvas) {
    console.log('Failed to init canvas');
    return;
  }
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,255,1)';
  ctx.fillRect(120, 10, 150, 150);
}