'use strict'
const seedrandom = require('seedrandom')

function generator (seed) {
  const rng = seedrandom(seed)

  function float (min, max) {
    return min + (max - min) * rng()
  }

  function int (min, max) {
    return Math.floor(float(min, max))
  }

  function color () {
    return 'rgb(' + int(0, 256) + ',' + int(0, 256) + ',' + int(0, 256) + ')'
  }

  return {
    float: float,
    int: int,
    color: color
  }
}

module.exports = function ({canvas, seed, width, height}) {
  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 2

  const generate = generator(seed)

  ctx.fillStyle = generate.color()
  ctx.fillRect(0, 0, width, height)

  const linesCount = generate.int(10, 20)
  for (var i = 0; i !== linesCount; ++i) {
    ctx.beginPath()
    ctx.moveTo(generate.int(0, width), generate.int(0, height))
    ctx.lineTo(generate.int(0, width), generate.int(0, height))
    ctx.strokeStyle = generate.color()
    ctx.stroke()
  }
}
