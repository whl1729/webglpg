const VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_scaleMatrix;

void main() {
  gl_Position = u_scaleMatrix * a_Position;
}
`

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

const scales = [0.5, 0.5, 1.0]

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

  const pointCount = initVertexBuffers(gl)
  if (pointCount < 0) {
    console.error('Failed to set the positions of the vertices.')
    return
  }

  const scaleMatrix = new Float32Array([
    scales[0], 0.0, 0.0, 0.0,
    0.0, scales[1], 0.0, 0.0,
    0.0, 0.0, scales[2], 0.0,
    0.0, 0.0, 0.0, 1.0,
  ])

  const u_scaleMatrix = gl.getUniformLocation(gl.program, 'u_scaleMatrix')
  if (!u_scaleMatrix) {
    console.error('Failed to get the location of u_scaleMatrix')
    return
  }

  gl.uniformMatrix4fv(u_scaleMatrix, false, scaleMatrix)

  gl.drawArrays(gl.TRIANGLES, 0, pointCount)
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ])

  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.error('Failed to create the buffer object.')
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
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
