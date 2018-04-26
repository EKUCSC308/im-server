# Instant Messaging Server

## Endpoints
An `endpoint` is a URL that executes a specific operation within an app. For example, the `{url}/auth/login` endpoint will allow users to sign in to the app. All of the necessary endpoints required by the client (iPhone app), are listed below. Each endpoint includes a request type (i.e `GET` or `POST`), URL, and the information that must be sent to the endpoint.

In the iPhone app, create a couple classes that contain functions which send requests to the API. The structure should look like this:

```
/net    <-- create a directory called "net" inside the project. This will contain your classes.
|---- Auth.swift
|---- Conversations.swift
```

```swift
// inside "Auth.swift"
struct LoginResponse {
    var jwt: string
}

class Auth {
    let jwt: string = ""
    
    init (jwt: string) {
        this.jwt = jwt
    }

    func login(username: string, password:string) -> LoginResponse {
        // Create the HTTP request
        var request = URLRequest(url: "http://192.241.175.100:3002/auth/login")
        
        // Set request type to "POST" (default is "GET")
        request.httpMethod = "POST"
        
        // Tell the server you are sending JSON
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Send username and password with request
        request.httpBody = JSONEncoder().encode([
            "username": username,
            "password": password
        ])

        // Add the "authorization" header to the request.
        // Replace <jwt> with the JWT from the app's session storage
        request.setValue("Bearer \(jwt)", forHTTPHeaderField: "Authorization")
        
        // Execute the request
        let task = URLSession.shared.dataTask(with: request, completionHandler: { (responseData: Data?, response: URLResponse?, error: Error?) in
            
            return LoginResponse (
                jwt: responseData
            )
            
        })
        task.resume()
    }
}
```

### Base URL

All requests should be sent to...

```
http://192.241.175.100:3002
```

For example:

```
http://192.241.175.100:3002/auth/login
```

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

#### Checking if a user is signed in to the app
When the app boots, it should check its session storage for a `jwt`. Remember, an authentication token is required to be sent with each request to the API, so if a `jwt` doesn't exist in session storage, we should assume the user is logged out and show the login/register view.

#### Signing out of the app
Simply delete the `jwt` from session storage. The user will have to login again to get a new token.

## Errors
Successful HTTP requests usually return a `200` status code. Unsuccessful requests return a non-`200` status code, indicating an error has occurred. 

#### 403 Forbidden status code
The API will return a `403` status code if a request is sent without a valid authorization header. The only exception to this rule is the `/auth/login` endpoint, since you it creates the authorization token in the first place.

#### 400 Bad Request status code
An API request will return a 400 status code if a field is missing from the request. For example, the `/auth/register` endpoint requires two fields: `username` and `password`. If you send a request to that endpoint without including the username and password, a 400 response will be returned.
