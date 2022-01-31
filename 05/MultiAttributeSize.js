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
    console.error('Failed to get the rendering context for WebGL.')
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to initialize shaders.')
    return
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const pointCount = initVertices(gl)
  if (pointCount < 0) {
    console.error('Failed to set the positions of the vertices.')
    return
  }

  gl.drawArrays(gl.POINTS, 0, pointCount)
}

function initVertices(gl) {
  let vertexCount = initVertexBuffer(gl)
  if (vertexCount < 0) {
    console.error('Failed to initialize vertex buffer')
    return vertexCount
  }

  vertexCount = initVertexSizeBuffer(gl)
  if (vertexCount < 0) {
    console.error('Failed to initialize vertex size buffer')
    return vertexCount
  }

  return vertexCount
}

function initVertexBuffer(gl) {
  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.error('Failed to create the buffer object.')
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ])

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.error('Failed to get the storage location of a_Position')
    return -1
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  return vertices.length / 2
}

function initVertexSizeBuffer(gl) {
  const sizeBuffer = gl.createBuffer()
  if (!sizeBuffer) {
    console.error('Failed to create the buffer object.')
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)

  const vertexSizes = new Float32Array([
    10.0, 20.0, 30.0
  ])

  gl.bufferData(gl.ARRAY_BUFFER, vertexSizes, gl.STATIC_DRAW)

  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_PointSize < 0) {
    console.error('Failed to get the storage location of a_PointSize')
    return -1
  }

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_PointSize)

  return vertexSizes.length
}
