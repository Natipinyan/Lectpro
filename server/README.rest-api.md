# RESTful API Documentation

## Student Authentication & Management

| Method | Endpoint                      | Description                        | Request Body                | Response                |
|--------|--------------------------------|------------------------------------|-----------------------------|-------------------------|
| POST   | /students/login               | Student login                      | { userName, password }      | { loggedIn, user, ... } |
| GET    | /students/register            | Get all students (admin only)      | -                           | Array of students       |
| POST   | /students/register            | Register new student               | { userName, ... }           | { message, user }       |
| GET    | /students/register/me         | Get current student info           | - (cookie)                  | { user }                |
| PUT    | /students/register/me         | Update current student             | { ...fields }               | { message, user }       |
| DELETE | /students/register/me         | Delete current student             | -                           | { message }             |
| POST   | /students/register/forgot-password | Request password reset         | { email }                   | { message }             |
| GET    | /students/register/reset-password | Reset password (via link)      | { code, newPassword }       | { message }             |
| GET    | /apiStudent/check-auth      | Check student authentication       | - (cookie)                  | { isAuthenticated, user }|
| POST   | /apiStudent/logout          | Student logout                     | -                           | { loggedOut, message }  |

## Projects

| Method | Endpoint                              | Description                        | Request Body         | Response                |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|
| GET    | /projects/                            | Get all projects                   | -                    | Array of projects       |
| GET    | /projects/:projectId                  | Get a project by ID                | -                    | Project object          |
| POST   | /projects/                            | Create a new project               | Project fields (JSON)| Project object          |
| PUT    | /projects/:projectId                  | Update a project by ID             | Project fields (JSON)| Project object          |
| DELETE | /projects/:projectId                  | Delete a project by ID             | -                    | 204 No Content          |
| GET    | /projects/:projectId/technologies     | Get technologies for a project     | -                    | Array of technologies   |
| GET    | /projects/:projectId/file             | Get file for a project             | -                    | File download           |

## Technologies

| Method | Endpoint                              | Description                        | Request Body         | Response                |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|
| GET    | /technology/                          | Get all technologies               | -                    | Array of technologies   |
| POST   | /technology/                          | Create a new technology            | Technology fields    | Success message         |
| PUT    | /technology/:technologyId             | Update a technology by ID          | Technology fields    | Success message         |
| DELETE | /technology/:technologyId             | Delete a technology by ID          | -                    | Success message         |

## Uploads

| Method | Endpoint                              | Description                        | Request Body         | Response                |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|
| POST   | /upload/addFile                       | Upload a file for a project (old)  | Multipart/form-data (file, projectTitle) | Success message, path   |
| POST   | /upload/:projectId/file               | Upload a file for a project (RESTful, currently also expects projectTitle in formData) | Multipart/form-data (file, projectTitle) | Success message, path   |

---

- All routes require authentication (authenticateToken)
- Old routes remain available in parallel
- Update the client to use the new RESTful routes as needed 