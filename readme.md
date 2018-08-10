# Apigee-Auth

Apigee-Auth retrieves [Apigee OAuth2 Access Tokens](https://docs.apigee.com/api-platform/system-administration/using-oauth2-security-apigee-edge-management-api) from a username/password. It automatically utilize refresh tokens when the current access token has expired so that we can always retrieve the next valid access token.

# Install

`$ npm install apigee-auth`

# Basic Usage

```JavaScript
const ApigeeAuth = require('apigee-auth')
const apigeeAuth = new ApigeeAuth('username', 'password')

apigeeAuth.getToken().then(response => {
  console.log(response.access_token)
})
```

# 2FA/MFA tokens (optional)

If you have two factor authentication enabled, you could pass in your [TOTP](https://en.wikipedia.org/wiki/Time-based_One-time_Password_algorithm) secret as the 3rd parameter.

```JavaScript
const apigeeAuth = new ApigeeAuth('username', 'password', 'your-2fa-totp-secret')
```

**Please note that if you are using 2FA this way, you are no longer using two factor authentication because you may have compromised your 2FA secret by storing your 2FA secret outside your mobile device or mobile key.**

This optional parameter is provided as convenience if you must require 2FA in your logins but still want to automate Apigee Management APIs in your environment. 

# Reference

`getToken()`

* returns: Promise with the JSON output as specified by the [Apigee OAuth2 Access Tokens](https://docs.apigee.com/api-platform/system-administration/using-oauth2-security-apigee-edge-management-api) documentation for POSTing to https://login.apigee.com/oauth/token

# Creating a reusable axios instance

If you use [axios](https://github.com/axios/axios), you could create a reusable instance using [axios interceptors](https://github.com/axios/axios#interceptors):

```JavaScript
const client = axios.create()

client.interceptors.request.use(
  async config => {
    const { access_token } = await apigeeAuth.getToken()
    return Promise.resolve({
      ...config,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
  },
  err => Promise.reject(err)
)
```
