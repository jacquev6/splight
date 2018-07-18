'use strict'

const fs = require('fs-extra')
const Joi = require('joi')
const neatJSON = require('neatjson').neatJSON

const slug = Joi.string().required().min(1)
const name = Joi.string().required().min(1)

const schema = Joi.object({
  artists: Joi.object().required().pattern(
    Joi.string(),
    Joi.object({
      name
    })
  ),
  cities: Joi.array().required().min(1).items(Joi.object({
    slug,
    name,
    tags: Joi.array().required().min(1).items(Joi.object({
      slug,
      title: name
    })),
    locations: Joi.object().required().pattern(
      Joi.string(),
      Joi.object({
        name
      })
    ),
    events: Joi.array().required().items(Joi.object({
      artist: Joi.string(),
      location: Joi.string().required(),
      occurences: Joi.array().required().min(1).items(Joi.object({
        start: Joi.string().regex(/^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]$/)
      })),
      tags: Joi.array().required().items(Joi.string()),
      title: Joi.string()
    }))
  }))
}).strict()

async function load (fileName) {
  return Joi.attempt(await fs.readJSON(fileName), schema)
}

async function dump (data, fileName) {
  return fs.outputFile(
    fileName,
    neatJSON(Joi.attempt(data, schema), {sort: true, wrap: 120, afterColon: 1, afterComma: 1}) + '\n'
  )
}

exports.load = load
exports.dump = dump
