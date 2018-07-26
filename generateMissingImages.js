'use strict'

const assert = require('assert').strict
const Canvas = require('canvas')
const fs = require('fs-extra')
const path = require('path')
const seedrandom = require('seedrandom')

function randomGenerator (seed) {
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

  return {float, int, color}
}

function png2ico ({width, height, png}) {
  assert(width < 256)
  assert(height < 256)

  const s0 = png.length % 256
  const s1 = Math.floor(png.length / 256) % 256
  const s2 = Math.floor(png.length / 256 / 256) % 256
  const s3 = Math.floor(png.length / 256 / 256 / 256) % 256
  assert.equal(png.length, s0 + (256 * s1 + 256 * (s2 + 256 * s3)))

  const header = Buffer.from([
    // https://en.wikipedia.org/wiki/ICO_%28file_format%29#Outline
    // ICONDIR
    0, 0, // Reserved
    1, 0, // .ico
    1, 0, // 1 image
    // ICONDIRENTRY
    width,
    height,
    0, // No palette
    0, // Reserved
    0, 0, // Color planes
    0, 0, // Bits per pixels
    s0, s1, s2, s3, // Size of data
    22, 0, 0, 0 // Offset of data
  ])

  return Buffer.concat([header, png])
}

function makePng ({width, height, seed}) {
  const generate = randomGenerator(seed)

  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 2

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

  return canvas.toBuffer()
}

async function ensure (fileName, thunk) {
  try {
    await fs.access(fileName, fs.constants.F_OK)
    console.log(fileName, 'is already there')
  } catch (err) {
    console.log('Generating', fileName)
    fs.outputFile(fileName, thunk())
  }
}

async function main (dataDirectory) {
  function p () {
    return path.join(dataDirectory, 'images', ...arguments)
  }

  ensure(
    p('favicon.ico'),
    () => {
      const width = 16
      const height = 16
      return png2ico({width, height, png: makePng({width, height, seed: 'favicon'})})
    }
  )
  ensure(
    p('ads', '468x60.png'),
    () => makePng({width: 468, height: 60, seed: 'Publicité 468x60'})
  )
  ensure(
    p('ads', '160x600.png'),
    () => makePng({width: 160, height: 600, seed: 'Publicité 160x600'})
  )

  ensure(
    p('all-tags.png'),
    () => makePng({width: 1104, height: 200, seed: "Toute l'actualité"})
  )

  const data = await fs.readJSON(path.join(dataDirectory, 'data.json'))

  for (var city of data.cities) {
    ensure(p(city.slug + '.png'), (seed => () => makePng({width: 253, height: 200, seed}))(city.name))
    for (var tag of city.tags) {
      ensure(p(city.slug, tag.slug + '.png'), (seed => () => makePng({width: 253, height: 200, seed}))(tag.title))
    }
  }
}

main(process.argv[2])
