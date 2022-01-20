function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('example')
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element')
    return
  }

  // Get the rendering context for 2DCG
  const ctx = canvas.getContext('2d')

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'  // Set a blue color
  ctx.fillRect(300, 100, 1500, 1500)
}
