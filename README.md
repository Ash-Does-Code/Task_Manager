
---

# Task Manager API Documentation

Base URL:

```
http://localhost:3000
```

All responses are in **JSON**.

---

## Authentication Overview

This API uses **JWT-based authentication** with:

* **Access Token** → short-lived (15 minutes)
* **Refresh Token** → long-lived (7 days, stored in DB)

### Protected routes require:

```
Authorization: Bearer <accessToken>
```

---

# Auth APIs

---

## Signup

Create a new user account.

### Endpoint

```
POST /signup
```

### Request Body

```json
{
  "name": "tylerdurden",
  "email": "tylerdurden@example.com",
  "password": "password123"
}
```

### Success Response (201)

```json
{
  "_id": "65b8f1a0c9d4e12345678901",
  "name": "tylerdurden",
  "email": "tylerdurden@example.com",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T10:00:00.000Z"
}
```

### Error Responses

* `400` – Missing fields
* `409` – User already exists
* `500` – Server error

---

## Login

Authenticate user and receive tokens.

### Endpoint

```
POST /login
```

### Request Body

```json
{
  "email": "tylerdurden@example.com",
  "password": "password123"
}
```

### Success Response (200)

```json
{
  "message": "Login successful",
  "accessToken": "JWT_ACCESS_TOKEN",
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

### Error Responses

* `401` – Invalid email or password
* `500` – Server error

---

##  Refresh Access Token

Get a new access token when the old one expires.

### Endpoint

```
POST /token
```

### Request Body

```json
{
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

### Success Response (200)

```json
{
  "accessToken": "NEW_JWT_ACCESS_TOKEN"
}
```

### Error Responses

* `401` – Refresh token missing
* `403` – Invalid or expired refresh token
* `500` – Server error

---

##  Logout

Invalidate refresh token.

### Endpoint

```
POST /logout
```

### Request Body

```json
{
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

### Success Response (200)

```json
{
  "message": "Logged out successfully"
}
```

---

# 🧾 Task APIs (Protected)

⚠️ **All task routes require an access token**
Add header:

```
Authorization: Bearer <accessToken>
```

---

## Get All Tasks

Fetch tasks belonging to the logged-in user.

### Endpoint

```
GET /tasks
```

### Success Response (200)

```json
[
  {
    "_id": "65c1f3a9e1c9a12345678901",
    "title": "Learn Express",
    "description": "JWT and middleware",
    "completed": false,
    "userId": "65b8f1a0c9d4e12345678901",
    "createdAt": "2026-01-16T09:30:00.000Z",
    "updatedAt": "2026-01-16T09:30:00.000Z"
  }
]
```

---

##  Create Task

Create a new task for the logged-in user.

### Endpoint

```
POST /tasks
```

### Request Body

```json
{
  "title": "Build Task API",
  "description": "CRUD with auth",
  "completed": false
}
```

### Success Response (201)

```json
{
  "_id": "65c1f3a9e1c9a12345678902",
  "title": "Build Task API",
  "description": "CRUD with auth",
  "completed": false,
  "userId": "65b8f1a0c9d4e12345678901",
  "createdAt": "2026-01-16T10:00:00.000Z",
  "updatedAt": "2026-01-16T10:00:00.000Z"
}

some sample tasks:
[
  {
    "title": "Setup Express Project",
    "description": "Initialize npm, install express and nodemon",
    "completed": true
  },
  {
    "title": "Create Task Model",
    "description": "Define mongoose schema for tasks",
    "completed": true
  },
  {
    "title": "Implement JWT Authentication",
    "description": "Protect routes using JWT middleware",
    "completed": false
  },
  {
    "title": "Add Pagination to Tasks API",
    "description": "Use limit and skip query params",
    "completed": false
  }
]


```

---

##  Update Task

Update an existing task (only if user owns it).

### Endpoint

```
PUT /tasks/:id
```

### URL Params

```
id → Task ID
```

### Request Body

```json
{
  "completed": true
}
```

### Success Response (200)

```json
{
  "_id": "65c1f3a9e1c9a12345678902",
  "title": "Build Task API",
  "description": "CRUD with auth",
  "completed": true,
  "userId": "65b8f1a0c9d4e12345678901",
  "updatedAt": "2026-01-16T11:00:00.000Z"
}
```

---

## Delete Task

Delete a task owned by the user.

### Endpoint

```
DELETE /tasks/:id
```

### Success Response (200)

```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

---

#  Security Notes

* Passwords are hashed using **bcrypt**
* Password field is hidden by default
* JWT payload contains minimal user info
* Refresh tokens are stored in MongoDB
* Users can access **only their own tasks**

---

#  Token Lifecycle Summary

```
Login → accessToken + refreshToken
Access token expires → POST /token
New access token issued
Logout → refresh token deleted
```

---

#  Status Codes Summary

| Code | Meaning      |
| ---- | ------------ |
| 200  | OK           |
| 201  | Created      |
| 400  | Bad request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 409  | Conflict     |
| 500  | Server error |


---

