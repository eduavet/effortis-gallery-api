# API Documentation

## Auth

### Create new user

`POST /auth/register`

Payload:

* username `(String)`
* password `(String, min. 8 characters)`

Successful response returns object `{ message: 'Signed up successfully' }`

Can return errors:
* 400: Validation error
* 409: User with that username already exists

### Login

`POST /auth/login`

Payload:

* username `(String)`
* password `(String)`

Successful response returns user object

Can return error:
* 400: Validation error
* 401: Wrong username/password combination

### Get user object

`GET /auth/user`

Successful response returns user object

Can return error:
* 401: Unauthorized

### Logout

`GET /auth/logout`

Successful response returns message 'Logged out'


## Images

### Get user images

`GET /images/get`

Query:

* owner `(uuid)`

Successful response returns array of image objects

Can return errors:
* 400: Validation error

### Add images

`POST /images/add`

Params:

* title `(String)`
* location `(String)`
* owner `(uuid)`
* file `(file)`

Successful response returns message 'Image successfully uploaded'

Can return errors:
* 400: Validation error

### Update image

`PUT /images/update`

Params:

* title `(String)`
* location `(String)`
* owner `(uuid)`
* uuid `(uuid)`

Successful response returns message 'Image successfully updated'

Can return errors:
* 400: Validation error
* 404: Image not found

### Update delete

`DELETE /images/delete`

Params:

* owner `(uuid)`
* uuid `(uuid)`

Successful response returns message 'Image successfully deleted'

Can return errors:
* 400: Validation error
* 404: Image not found
