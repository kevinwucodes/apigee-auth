const axios = require('axios')
const querystring = require('querystring')

const { oauthTokenUrl } = require('../config')

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    //edgecli:edgeclisecret (hardcoded per Apigee docs)
    Authorization: 'Basic ZWRnZWNsaTplZGdlY2xpc2VjcmV0',
    Accept: 'application/json;charset=utf-8'
  }
}

const getTokenFromUsername = async (username, password) => {
  return await axios(oauthTokenUrl, {
    ...options,
    data: querystring.stringify({
      username,
      password,
      grant_type: 'password'
    })
  }).then(result => result.data)
}

const getTokenFromRefreshToken = async refresh_token => {
  return axios(oauthTokenUrl, {
    ...options,
    data: querystring.stringify({
      refresh_token,
      grant_type: 'refresh_token'
    })
  }).then(result => result.data)
}

module.exports = { getTokenFromUsername, getTokenFromRefreshToken }
