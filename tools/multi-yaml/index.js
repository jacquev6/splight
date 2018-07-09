'use strict'

const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')

function mergeData (data, newData) {
  if (!data) {
    return newData
  } else if (Array.isArray(data) && Array.isArray(newData)) {
    return data.concat(newData)
  } else if (Array.isArray(data) && typeof (newData) === 'object') {
    for (const k in newData) {
      data.push(newData[k])
    }
    return data
  } else if (typeof (data) === 'object' && typeof (newData) === 'object') {
    for (const k in newData) {
      const v = data[k]
      if (v) {
        data[k] = mergeData(v, newData[k])
      } else {
        data[k] = newData[k]
      }
    }
    return data
  } else {
    throw new Error('Types incompatible for merging: ' + typeof (data) + ' and ' + typeof (newData))
  }
}

function load (dirName) {
  const extensions = ['.json', '.yml', '.yaml']
  const noDataToLoad = 'No data to load'

  const [isFile, fileContents] = (function () {
    var isFile = false
    const fileContents = []

    extensions.forEach(function (ext) {
      [dirName + ext, path.join(dirName, ext)].forEach(function (fileName) {
        try {
          fileContents.push(fs.readFileSync(fileName))
          isFile = true
        } catch (e) {
        }
      })
    })

    return [isFile, fileContents]
  })()

  const [isDirectory, directoryContents] = (function () {
    try {
      return [true, fs.readdirSync(dirName)]
    } catch (e) {
      return [false, []]
    }
  })()

  var data = null

  fileContents.forEach(function (contents) {
    data = mergeData(data, yaml.safeLoad(contents))
  })

  if (isDirectory) {
    const newData = {}
    directoryContents.map(name => {
      const key = (function () {
        const [radix, ext] = name.split('.')
        if (extensions.indexOf('.' + ext) !== -1) {
          return radix
        } else {
          return name
        }
      })()

      if (key) {
        try {
          newData[key] = load(path.join(dirName, key))
        } catch (e) {
          if (e.message !== noDataToLoad) {
            throw e
          }
        }
      }
    })
    data = mergeData(data, newData)
  };

  if (isFile || isDirectory) {
    return data
  } else {
    throw new Error(noDataToLoad)
  }
}

exports.load = load
