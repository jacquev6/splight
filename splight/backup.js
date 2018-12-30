'use strict'

const childProcess = require('child_process')
const googleCloudStorage = require('@google-cloud/storage')
const moment = require('moment')

const storage = new googleCloudStorage.Storage({
  projectId: 'jacquev6-0001',
  keyFilename: './jacquev6-0001-430328cf0505.json'
})

function backup () {
  const fileName = makeFileName(moment().format('YYYYMMDD-HHmmss'))
  console.log('Backup to ' + fileName)

  const mongodump = childProcess.spawn('mongodump', ['--uri', 'mongodb://splight-mongo:27017/splight', '--archive', '--gzip'])
  mongodump.stderr.pipe(process.stderr)
  mongodump.stdout.pipe(storage.bucket('splight-backups').file(fileName).createWriteStream())
}

function restore (datetime) {
  const fileName = makeFileName(datetime)
  console.log('Restore from ' + fileName)

  const mongorestore = childProcess.spawn('mongorestore', ['--uri', 'mongodb://splight-mongo:27017/splight', '--drop', '--archive', '--gzip'])
  mongorestore.stdout.pipe(process.stdout)
  mongorestore.stderr.pipe(process.stderr)
  storage.bucket('splight-backups').file(fileName).createReadStream().pipe(mongorestore.stdin)
}

function makeFileName (datetime) {
  return 'mongodump-' + datetime + '.gz'
}

if (process.argv[2] === 'backup') {
  backup()
} else if (process.argv[2] === 'restore') {
  restore(process.argv[3])
} else {
  console.log('Usage: ' + process.argv[1] + ' [backup | restore YYYMMDD-HHMMSS]')
  process.exit(1)
}
