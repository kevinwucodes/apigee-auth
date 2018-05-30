# Apigee-Auth

# **NOTE: this does not take into account of refresh tokens expiration so back to the drawing board!  Do not use this.**


Apigee-Auth retrieves Apigee access tokens from a username/password. It automatically tries to utilize refresh tokens when the access token is nearing expiration so that we can always retrieve the latest and valid access token.

Each apigee access token is valid for 1799 seconds (~30 minutes). Apigee-Auth handles the next access token retrieval using a refresh token when the expiration of the access token is at 80%. This is `1799 * 0.8 = 1439 seconds (~24 minutes)`

# Basic Usage

```JavaScript
const ApigeeAuth = require('apigee-auth')
const apigeeAuth = new ApigeeAuth('username', 'password')

apigeeAuth.getToken().then(response => {
  console.log(response.access_token)
})

//destroy the instance when you're done
apigeeAuth.destroy()
```

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

# Reference

`getToken()`
* returns: Promise with the JSON output as specified by the Apigee Documentation for POSTing to https://login.apigee.com/oauth/token


`destroy()`
* returns: Boolean

Destroys the ApigeeAuth instance.
