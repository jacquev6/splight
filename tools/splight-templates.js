'use strict'

// Using require on html files works as-is in web browsers thanks to browserify and stringify
// In Node.js however, one must call stringify.registerWithRequire(['.html']) before requiring this module

exports.container = require('./templates/container.html')

exports.staticContent = {
  index: require('./templates/static_content/index.html'),
  city: {
    index: require('./templates/static_content/city_index.html')
  }
}
