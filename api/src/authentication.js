'use strict'

function register (app) {
  app.get('/login', (req, res) => {
    const viewer = getViewer(req)
    var form
    if (viewer) {
      form = '<input type="submit" value="Logout (' + viewer + ')"/>'
    } else {
      form = '<label>Username: <input type="text" name="username"/></label> <input type="submit" value="Login"/>'
    }
    res
      .type('text/html')
      .send('<!DOCTYPE html><html><head><title>Login/logout</title></head><body><form method="POST">' + form + '</form></body></html>')
  })

  app.post('/login', (req, res) => {
    // @todo Check the provided credentials!
    const username = req.body.username
    if (username) {
      res.cookie('username', username)
    } else {
      res.clearCookie('username')
    }
    res.redirect('/login')
  })
}

function getViewer (req) {
  return req.cookies.username
}

Object.assign(exports, { register, getViewer })
