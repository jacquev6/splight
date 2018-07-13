'use strict'

require('stringify').registerWithRequire(['.html'])

const multiYaml = require('./multiYaml')
const generator = require('./splight/generator')

generator.generate(multiYaml.load(process.argv[2]), process.argv[3])
