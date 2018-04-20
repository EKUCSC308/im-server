# Instant Messaging Server

## Endpoints

### Register user account

```
POST /auth/register

{
    "username": "...",
    "password": "..."
}
```

#### Response

```
{
    "success": true
}
```

### Login

```
POST /auth/login

{
    "username": "...",
    "password": "..."
}
```

#### Response

```
{
    "jwt": "..."
}
```

### Create conversation

```
POST /conversations/create

{
    "label": "..."
}
```

#### Response

```
{
    "label": "...",
    "token": "..."
}
```

### List conversations

```
GET /conversations
```

#### Response

```
{
    "conversations": [
        {
            "token": "...",
            "label": "..."
        },
        {
            "token": "...",
            "label": "..."
        }
    ]
}
```

## Authentication
Most endpoints in the API require an authentication token. The login endpoint is the only endpoint that does not require it.

The type of authentication token used in this application is called a [Json Web Token](https://jwt.io) or "JWT" for short (pronounced "Jot"). You don't have to understand the contents of this token. Just know that it must be included in each request to the API.

#### Acquiring an auth token
When you send a username and password to the `/auth/login` endpoint, the server will send back a `jwt` field (assuming the username/password combination is correct). You should store that JWT in the iPhone session storage so you can reference it when sending API requests in other parts of the app.

#### Using the auth token
To send the JWT with a request, set the [authorization request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). The format should look something like the following, where `<jwt>` would be replaced with your auth token.

```
Authorization: Bearer <jwt>
```

#### Adding a request header in swift

```swift
// Create the HTTP request
var request = URLRequest(url: "http://domain.com/conversations")

// Add the "authorization" header to the request
request.setValue("Bearer <jwt>", forHTTPHeaderField: "Authorization")
```

#### Logging out
When the user logs out of the app, the JWT should be removed from the app's session storage.

## Errors
Successful HTTP requests usually return a `200` status code. Unsuccessful requests return a non-`200` status code, indicating an error has occurred. 

#### 403 Forbidden status code
The API will return a `403` status code if a request is sent without a valid authorization header. The only exception to this rule is the `/auth/login` endpoint, since you it creates the authorization token in the first place.

#### 400 Bad Request status code
An API request will return a 400 status code if a field is missing from the request. For example, the `/auth/register` endpoint requires two fields: `username` and `password`. If you send a request to that endpoint without including the username and password, a 400 response will be returned.