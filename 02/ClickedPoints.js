const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}
`

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

function main() {
  const canvas = document.getElementById('webgl')

  const gl = getWebGLContext(canvas)
  if (!gl) {
    console.error('Failed to get the rendering context for WebGL')
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to initialize shaders')
    return
  }

  let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.error('Failed to get the storage location of a_Position')
    return
  }

  let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_PointSize < 0) {
    console.error('Failed to get the storage location of a_PointSize')
    return
  }

  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
  gl.vertexAttrib1f(a_PointSize, 10.0)

  canvas.onmousedown = (ev) => { click(ev, gl, canvas, a_Position) }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)
}

// The array for a mouse press
const g_points = []

function click(ev, gl, canvas, a_Position) {
  let x = ev.clientX;
  let y = ev.clientY;
  const rect = ev.target.getBoundingClientRect()

  x = ((x - rect.left) - canvas.height/2) / (canvas.height/2)
  y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2)
  g_points.push(x)
  g_points.push(y)

  gl.clear(gl.COLOR_BUFFER_BIT)

  const len = g_points.length
  for (let i = 0; i < len; i += 2) {
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
