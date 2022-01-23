const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;

void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}
`

const FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;

void main() {
  gl_FragColor = u_FragColor;
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

  let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
  if (u_FragColor < 0) {
    console.error('Failed to get the storage location of u_FragColor')
    return
  }

  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
  gl.vertexAttrib1f(a_PointSize, 10.0)

  canvas.onmousedown = (ev) => { click(ev, gl, canvas, a_Position, u_FragColor) }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)
}

// The array for a mouse press
const g_points = []

// The array to store the color of a point
const g_colors = []

function click(ev, gl, canvas, a_Position, u_FragColor) {
  let x = ev.clientX;
  let y = ev.clientY;
  const rect = ev.target.getBoundingClientRect()

  x = ((x - rect.left) - canvas.height/2) / (canvas.height/2)
  y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2)
  g_points.push([x, y])

  if (x >= 0.0 && y >= 0.0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0])
  } else if (x < 0.0 && y < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0])
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0])
  }

  gl.clear(gl.COLOR_BUFFER_BIT)

  const len = g_points.length
  for (let i = 0; i < len; i++) {
    let xy = g_points[i]
    let rgba = g_colors[i]
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
