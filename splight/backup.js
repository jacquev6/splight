const childProcess = require('child_process')
const googleCloudStorage = require('@google-cloud/storage')
const moment = require('moment')

const storage = new googleCloudStorage.Storage({
  projectId: 'jacquev6-0001',
  keyFilename: './jacquev6-0001-430328cf0505.json'
})

fileName = 'mongodump-' + moment().format('YYYYMMDD-HHmmss') + '.gz'

const mongodump = childProcess.spawn('mongodump', ['--archive', '--gzip', '--uri', 'mongodb://splight-mongo:27017/splight'])
mongodump.stderr.pipe(process.stderr)
mongodump.stdout.pipe(storage.bucket('splight-backups').file(fileName).createWriteStream())
