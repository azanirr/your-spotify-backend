let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

// const SPOTIFY_CLIENT_ID = "a062fe454ee741d28c950a231f764851";
// const SPOTIFY_CLIENT_SECRET = "f358993840b14e3e8a90d0d3f154accc";
let redirect_uri = 'https://kimi-no-spotify-backend.herokuapp.com/callback';

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: "a062fe454ee741d28c950a231f764851",
      scope: 'user-read-private user-read-email user-top-read',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        "a062fe454ee741d28c950a231f764851" + ':' + "f358993840b14e3e8a90d0d3f154accc"
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = 'https://kiminospotify.herokuapp.com/option'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 80
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)