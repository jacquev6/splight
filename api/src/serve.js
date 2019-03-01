'use strict'

const makeApp = require('./app')

async function serve () {
  console.log('Starting website...')

  const app = await makeApp({ mongodbUrl: process.env.SPLIGHT_MONGODB_URL })

  app.listen(80, () => console.log('Website live!'))
}

serve()
