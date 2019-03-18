'use strict'

/* globals describe, it */

const assert = require('assert').strict
const gql = require('graphql-tag')
const { URLSearchParams } = require('url')

const testUtils = require('./test-utils')

const getViewer = gql`
  query {
    viewer {
      authenticated {
        name
      }
    }
  }
`

const getInstance = gql`
  query {
    instance {
      name
      warnings
    }
  }
`

describe('app tests', function () {
  const { success, fetch, baseUrl } = testUtils()

  it('responds to GET /', async function () {
    const res = await fetch(baseUrl())
    assert(res.ok)
  })

  it('responds to GET /login', async function () {
    const res = await fetch(baseUrl() + 'login')
    assert(res.ok)
  })

  it('allows login/logout cycle', async function () {
    const url = baseUrl() + 'login'

    var res = await fetch(url)
    assert(res.ok)
    assert((await res.text()).includes('value="Login"'))

    await success(
      getViewer, {},
      { viewer: { authenticated: null } }
    )

    const loginForm = new URLSearchParams()
    loginForm.append('username', 'abc')
    res = await fetch(url, { method: 'POST', body: loginForm })
    assert(res.ok)
    assert((await res.text()).includes('value="Logout (abc)"'))

    res = await fetch(url)
    assert(res.ok)
    assert((await res.text()).includes('value="Logout (abc)"'))

    await success(
      getViewer, {},
      { viewer: { authenticated: { name: 'abc' } } }
    )

    const logoutForm = new URLSearchParams()
    res = await fetch(url, { method: 'POST', body: logoutForm })
    assert(res.ok)
    assert((await res.text()).includes('value="Login"'))

    res = await fetch(url)
    assert(res.ok)
    assert((await res.text()).includes('value="Login"'))

    await success(
      getViewer, {},
      { viewer: { authenticated: null } }
    )
  })

  it('gets instance from env', async function () {
    process.env.SPLIGHT_INSTANCE_NAME = 'Instance Name'
    await success(
      getInstance, {},
      { instance: { name: 'Instance Name', warnings: [] } }
    )
    process.env.SPLIGHT_INSTANCE_WARNINGS = 'Warning'
    await success(
      getInstance, {},
      { instance: { name: 'Instance Name', warnings: ['Warning'] } }
    )
    process.env.SPLIGHT_INSTANCE_WARNINGS = 'Warning 1\nWarning 2'
    await success(
      getInstance, {},
      { instance: { name: 'Instance Name', warnings: ['Warning 1', 'Warning 2'] } }
    )
  })
})
