'use strict'

const moment = require('moment')
const path = require('path')

const publicWebsite = require('./publicWebsite')
const data = require('./data')

exports.populateApp = async function ({app, inputDataFile, scripts}) {
  for (var [name, content] of publicWebsite.generate({
    data: await data.load(inputDataFile),
    now: moment(),
    scripts
  })) {
    const text = await content
    name = '/' + name
    const type = path.extname(name)
    if (name.endsWith('/index.html')) {
      name = name.slice(0, -10)
    }
    app.get(name, (req, res) => res.type(type).send(text))
  }
}
