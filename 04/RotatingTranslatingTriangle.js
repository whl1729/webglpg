const VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;

void main() {
  gl_Position = u_ModelMatrix * a_Position;
}
`

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

// Rotation angle (degree/second)
const ANGLE_STEP = 45.0
const TRANSLATE_STEP = 0.05

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

  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
  if (!u_ModelMatrix) {
    console.error('Failed to get the location of u_ModelMatrix')
    return
  }

  // Current rotation angle of a triangle
  let currentAngle = 0.0
  let currentTranslate = -1.0

  // Create Matrix4 object for model transformation
  const modelMatrix = new Matrix4()

  const tick = function() {
    currentAngle = getAngle(currentAngle)
    currentTranslate = getTranslate(currentTranslate)
    draw(gl, pointCount, currentAngle, currentTranslate, modelMatrix, u_ModelMatrix)
    requestAnimationFrame(tick)  // Request that the browser calls tick
  }

  tick()
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

function draw(gl, pointCount, currentAngle, currentTranslate, modelMatrix, u_ModelMatrix) {
  // Set up rotation matrix
  modelMatrix.setRotate(currentAngle, 0.0, 0.0, 1.0)
  modelMatrix.translate(currentTranslate, 0.0, 0.0)

  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw a triangle
  gl.drawArrays(gl.TRIANGLES, 0, pointCount)
}

let g_last = Date.now()

function getAngle(angle) {
  // Calculate the elapsed time
  const now = Date.now()
  const elapsed = now - g_last  // milliseconds
  g_last = now
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0

  return newAngle % 360
}

function getTranslate(translate) {
  translate += TRANSLATE_STEP
  if (translate >= 1.0) {
    translate = -1.0
  }

  return translate
}
