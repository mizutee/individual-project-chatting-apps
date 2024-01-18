# Lodging API Documentation

## Endpoints :

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /google-sign-in`
- `GET /profile`
- `PUT /profile/:id`
- `PATCH /profile/:id`
- `DELETE /profile/:id`


&nbsp;

## 1. POST /register

Description:

- Register account to database

Request:

- body:

```json
{
  "email" : "string",
  "password" : "string",
  "fullName" : "string"
}
```

_Response (201 - Created)_

```json
{
    "id": "integer",
    "email": "string",
    "fullName": "string"
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "E-mail cannot be empty"
}

OR

{
    "message": "Password cannot be empty"
}

OR

{
    "message": "Full Name cannot be empty"
}

OR

{
    "message": "E-mail already registered"
}
```

&nbsp;

## 2. POST /login

Description:

- login using email and password

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
    "access_token": "string",
    "profile": {
        "id": "integer",
        "email": "string",
        "fullName": "string"
    }
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "Email or Password cannot be empty"
}
```

_Response (401 - Unauthorized)_

```json
{
    "message": "Error login user not found atau password not matched"
}
```

&nbsp;

## 3. POST /google-sign-in

Description:

- Login using google sign in

Request:

- body:

```json
{
    "email": "string",
    "displayName": "string"
}
```

_Response (200 - OK)_

```json
{
    "access_token": "string"
}
```

&nbsp;

## 4. GET /profile

Description:

- Get Profile data

Request:

- headers:

```json
{
    "access_token": "string"
}
```

- body :

```json

```

_Response (200 - OK)_

```json
{
    "id": "integer",
    "email": "string",
    "fullName": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "Profile": {
        "id": "integer",
        "username": "string",
        "gender": "string",
        "age": "integer",
        "imgUrl": "string",
        "UserId": "integer",
        "createdAt": "string",
        "updatedAt": "string"
    }
}
```

&nbsp;

## 5. PUT /profile/:id

Description:

- Update Profile

Request:

- headers:

```json
{
    "access_token": "string"
}
```

- params: 

```json
{
    "id": "integer"
}
```

- body:

```json
{
    "username": "string",
    "age": "integer",
    "gender": "string",
}
```

- file:

```json
{
    "imgUrl": "image"
}

```

_Response (201 - Created)_

```json
{
    "message": "Profile has been updated successfully"
}
```

&nbsp;

## 6. PATCH /profile/:id

Description:

- Upload profile picture

Request:

- headers:

```json
{
    "access_token": "string"
}
```

- params: 

```json
{
    "id": "integer"
}
```

- file:

```json
{
    "imgUrl": "image"
}

```

_Response (201 - Created)_

```json
{
    "message": "Profile has been updated successfully"
}
```

&nbsp;

## 7. DELETE /profile/:id

Description:

- Delete user

Request:

- headers:

```json
{
    "access_token": "string"
}
```

- params:

```json
{
    "id": "integer"
}
```

_Response (200 - OK)_

```json
{
    "message": "User has been deleted"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "No Authorization"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```
