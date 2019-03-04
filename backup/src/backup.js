'use strict'

const childProcess = require('child_process')
const googleCloudStorage = require('@google-cloud/storage')
const moment = require('moment')

const storage = new googleCloudStorage.Storage({
  projectId: process.env.SPLIGHT_PROJECT_ID,
  keyFilename: '/service-accounts/splight-backup.json'
})

function backup () {
  const fileName = process.env.SPLIGHT_INSTANCE_SLUG + '-' + moment().format('YYYYMMDD-HHmmss') + '-mongodump.gz'
  console.log('Backup to ' + fileName)

  const mongodump = childProcess.spawn('mongodump', ['--uri', process.env.SPLIGHT_MONGODB_URL, '--archive', '--gzip'])
  mongodump.stderr.pipe(process.stderr)
  mongodump.stdout.pipe(storage.bucket('splight-backups').file(fileName).createWriteStream())
}

function restore (fileName) {
  console.log('Restore from ' + fileName)

  const mongorestore = childProcess.spawn('mongorestore', ['--uri', process.env.SPLIGHT_MONGODB_URL, '--drop', '--archive', '--gzip'])
  mongorestore.stdout.pipe(process.stdout)
  mongorestore.stderr.pipe(process.stderr)
  storage.bucket('splight-backups').file(fileName).createReadStream().pipe(mongorestore.stdin)
}

async function restoreLatest (slug) {
  const fileNames = (await storage.bucket('splight-backups').getFiles({prefix: slug + '-'}))[0].map(({name}) => name)

  if (fileNames.length) {
    const fileName = fileNames.reduce(function (p, v) {
      return p > v ? p : v
    })
    restore(fileName)
  } else {
    console.log('Nothing to restore')
  }
}

if (process.argv[2] === 'backup') {
  backup()
} else if (process.argv[2] === 'restore') {
  restore(process.argv[3])
} else if (process.argv[2] === 'restore-latest') {
  restoreLatest(process.argv[3])
} else {
  console.log('Usage: ' + process.argv[1] + ' [backup | restore slug-yyyymmdd-hhmmss-mongodump.gz | restore-latest slug]')
  process.exit(1)
}
