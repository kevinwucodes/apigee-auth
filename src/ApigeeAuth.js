const {
  getTokenFromUsername,
  getTokenFromRefreshToken
} = require('./getApigeeTokens')

module.exports = class ApigeeAuth {
  constructor(username, password) {
    this.__username = username
    this.__password = password
    this.__token = null
    this.__accessTokenExpireIn = null
    this.__error = null

    this.getToken = this.getToken.bind(this)

    this.init()
  }

  async init() {
    await this.getAccessToken(this.__username, this.__password)
  }

  async getAccessToken(username, password) {
    return await getTokenFromUsername(username, password)
      .then(data => this.setAccessToken(data))
      .catch(err => this.setError(err))
  }

  async useRefreshToken(refreshToken) {
    return await getTokenFromRefreshToken(refreshToken)
      .then(data => this.setAccessToken(data))
      .catch(err => this.setError(err))
  }

  setAccessToken(token) {
    this.__token = token
    this.__accessTokenExpireIn = token.expires_in
    this.__error = null

    setTimeout(async () => {
      await this.useRefreshToken(this.__token.refresh_token)
    }, this.__accessTokenExpireIn * 1000 * 0.8) //we refetch at 80% of the expiration time
  }

  setError(err) {
    this.__token = null
    this.__accessTokenExpireIn = null
    this.__error = err
  }

  getToken() {
    return new Promise((resolve, reject) => {
      if (this.__token) return resolve(this.__token)
      if (this.__error) return reject(this.__error)

      //check every 500ms to see if we have a token
      const intervalId = setInterval(() => {
        if (this.__token) {
          clearInterval(intervalId)
          return resolve(this.__token)
        }
        if (this.__error) {
          clearInterval(intervalId)
          return reject(this.__error)
        }
      }, 500)

      //if we dont get anything after some time, we need to kill the previous interval
      setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId)
          return reject(
            'no token available from apigee or apigee auth is taking too long'
          )
        }
      }, 10 * 1000)
    })
  }
}
