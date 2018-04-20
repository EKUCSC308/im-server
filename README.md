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
```

#### Response

```
{
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