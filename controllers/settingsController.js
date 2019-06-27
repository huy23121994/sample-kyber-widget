var settings = require('../models/setting').settings
const axios = require('axios');

exports.index = function () {
  return {
    settings: settings
  }
}

exports.update = function (req, res) {
  settings.wallet = req.body.wallet
  settings.host = req.body.host
  res.redirect('/settings')
}

exports.getAccessToken = function (req, res) {
  if (!settings.accessToken) {
    url = `${settings.url}?grant_type=authorization_code&redirect_uri=${settings.redirect_uri}`
    client_id = settings.client_id
    client_secret = settings.client_secret

    axios.post(`${url}&client_id=${client_id}&client_secret=${client_secret}&code=${req.query.code}`).then(function (response) {
      settings.accessToken = response.data
      res.send(response.data)
    })
      .catch(function (error) {
        res.send(error.response.data.error_description)
      });
  } else {
    res.send(settings.accessToken)
  }
}

exports.getUserInfo = function (req, res) {
  accessToken = settings.accessToken
  if (accessToken) {
    axios.get(`http://localhost:3000/api/user_info`, {
      params: { access_token: accessToken.access_token }
    }).then(data => {
      res.send(data.data)
    }).catch(err => {
      console.log(err)
      res.send('Error status: ' + err.response.status + '\n Des: ' + err.response.statusText)
    })
  } else {
    console.log(accessToken)
    res.send('accessToken invalid')
  }
}