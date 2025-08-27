# REST API Documentation

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
| GET    | /apiStudent/external-check-auth | Check auth for external access    | -                           | { isAuthenticated, user }|
| POST   | /apiStudent/logout          | Student logout                     | -                           | { loggedOut, message }  |

## Instructor Authentication & Management

| Method | Endpoint                             | Description                       | Request Body                                              | Response                            |
|--------|--------------------------------------|-----------------------------------|-----------------------------------------------------------|-------------------------------------|
| POST   | /instructor/register/administrator   | Register new department admin     | { userName, email, pass, first_name, last_name, phone, department } | { message, success }                |
| POST   | /instructor/login                    | Instructor login                  | { userName, password }                                     | { loggedIn, user, ... }             |
| GET    | /instructor/register                 | Get all instructors (admin only)  | -                                                         | Array of instructors                |
| GET    | /instructor/register/insByDep        | Get all instructors by department | -                                                         | Array of instructors                |
| GET    | /instructor/register/stdByDep        | Get all students by department    | -                                                         | Array of students                   |
| GET    | /instructor/                         | Check if instructor is admin      | -                                                         | { success: true, isAdmin: boolean } | 
| POST   | /instructor/register                 | Register new instructor           | { userName, ... }                                         | { message, user }                   |
| PUT    | /instructor/register/toggle-status/:id | Toggle instructor active status   | -                                                         | { success, message }                |
| GET    | /instructor/register/me              | Get current instructor info       | - (cookie)                                                | { user }                            |
| PUT    | /instructor/register/me              | Update current instructor         | { ...fields }                                             | { message, user }                   |
| DELETE | /instructor/register/me              | Delete current instructor         | -                                                         | { message }                         |
| POST   | /instructor/register/forgot-password | Request password reset            | { email }                                                 | { message }                         |
| GET    | /instructor/register/reset-password  | Reset password (via link)         | { code, newPassword }                                     | { message }                         |
| GET    | /apiInstructor/check-auth            | Check instructor authentication   | - (cookie)                                                | { isAuthenticated, user }           |
| GET    | /apiInstructor/external-check-auth   | Check auth for external access    | -                                                         | { isAuthenticated, user }           |
| POST   | /apiInstructor/logout                | Instructor logout                 | -                                                         | { loggedOut, message }              |

## Departments

| Method | Endpoint                        | Description                                      | Request Body                        | Response                | Auth Required |
|--------|---------------------------------|-------------------------------------------------|-------------------------------------|------------------------|---------------|
| GET    | /departments/all                | Get all departments                              | -                                   | { success, message, data: departments } | None           |
| GET    | /departments/                   | Get department info by instructor ID           | - (cookie)                          | { success, message, data: department } | Instructor     |
| GET    | /departments/std                | Get department info by student ID              | - (cookie)                          | { success, message, data: department } | Student        |
| PUT    | /departments/:departmentId      | Update department name by ID (only admin)      | { currentID, newName }              | { success, message }   | Instructor     |

> Note: Only the instructor who is the admin of the department can update the department name.

## Projects

| Method | Endpoint                                      | Description                                      | Request Body          | Response                |
|--------|----------------------------------------------|-------------------------------------------------|-----------------------|-------------------------|
| GET    | /projects/                                   | Get all projects (student)                       | -                     | Array of projects       |
| GET    | /projects/ins                                | Get projects by instructor                       | -                     | Array of projects       |
| GET    | /projects/:projectId                         | Get a project by ID (student)                    | -                     | Project object          |
| GET    | /projects/ins/:projectId                     | Get a project by ID (instructor)                | -                     | Project object          |
| POST   | /projects/                                   | Create a new project                              | Project fields (JSON) | Project object          |
| PUT    | /projects/:projectId                         | Update a project by ID                            | Project fields (JSON) | Project object          |
| DELETE | /projects/:projectId                         | Delete a project by ID                            | -                     | 204 No Content          |
| GET    | /projects/:projectId/technologies            | Get technologies for a project (student)         | -                     | Array of technologies   |
| GET    | /projects/ins/:projectId/technologies        | Get technologies for a project (instructor)      | -                     | Array of technologies   |
| GET    | /projects/:projectId/file                    | Get file for a project (student)                  | -                     | File download           |
| GET    | /projects/ins/:projectId/file                | Get file for a project (instructor)              | -                     | File download           |

## Technologies

| Method | Endpoint                              | Description                        | Request Body         | Response                |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|
| GET    | /technology/                          | Get all technologies               | -                    | { success, data: technologies } |
| POST   | /technology/                          | Create a new technology            | Technology fields    | { success, message }    |
| PUT    | /technology/:technologyId             | Update a technology by ID          | Technology fields    | { success, message }    |
| DELETE | /technology/:technologyId             | Delete a technology by ID          | -                    | { success, message }    |

## Email

| Method | Endpoint                              | Description                        | Request Body         | Response                |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|
| POST   | /Email/                               | Send email                         | Email data            | Email response          |

## Uploads

| Method | Endpoint                              | Description                        | Request Body         | Response                |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|
| POST   | /upload/:projectId/file               | Upload a file for a project       | Multipart/form-data (file, projectTitle) | { success, message, data: { filePath } } |

## Comments

| Method | Endpoint                          | Description                              | Request Body                                    | Response                               | Auth Required          |
|--------|----------------------------------|----------------------------------------|------------------------------------------------|---------------------------------------|-----------------------|
| GET    | /comments                       | Get all comments (Instructor only)      | -                                              | { success: true, data: Array }         | Instructor             |
| GET    | /comments/:commentId            | Get comment by ID (Student)              | -                                              | { success: true, data: comment }       | Student                |
| GET    | /comments/ins/:commentId        | Get comment by ID (Instructor)           | -                                              | { success: true, data: comment }       | Instructor             |
| GET    | /comments/next/:commentId       | Get next comment by ID (Student)         | -                                              | { success, message, data: comment }    | Student                |
| GET    | /comments/prev/:commentId       | Get previous comment by ID (Student)     | -                                              | { success, data: comment }             | Student                |
| GET    | /comments/ins/next/:commentId   | Get next comment by ID (Instructor)      | -                                              | { success, message, data: comment }    | Instructor             |
| GET    | /comments/ins/prev/:commentId   | Get previous comment by ID (Instructor)  | -                                              | { success, data: comment }             | Instructor             |
| GET    | /comments/ins/project/:projectId | Get comments by project ID (Instructor) | -                                              | { success: true, data: { doneAndCompleted, doneButNotCompleted, notDone, counts } } | Instructor             |
| GET    | /comments/project/:projectId     | Get comments by project ID (Student)    | -                                              | { success: true, data: { doneAndCompleted, doneButNotCompleted, notDone, counts } } | Student                |
| POST   | /comments                       | Create a new comment (Instructor only)  | { project_id, title, section, page, text, is_done } | { success: true/false, message: string } | Instructor             |
| PUT    | /comments/:commentId            | Update a comment by ID (Instructor only) | { title, section, page, text, is_done }          | { success: true/false, message: string } | Instructor             |
| PUT    | /comments/isDone/:commentId     | Mark comment as done (Instructor only)  | -                                              | { success, message }                   | Instructor             |
| PUT    | /comments/:commentId/userDone   | Mark comment done with response (Student) | { response }                           | { success, message }                   | Student                |
| DELETE | /comments/:commentId            | Delete a comment by ID (Instructor only) | -                                              | { success: true/false, message: string } | Instructor             |

---

## Authentication & Authorization

- **Student Routes**: Most routes require student authentication (`authenticateToken`)
- **Instructor Routes**: Most routes require instructor authentication (`authenticateToken`)
- **Admin Routes**: Some routes require admin privileges (`checkAdmin`)

## Response Format

All API responses follow this format:
```json
{
  "success": boolean,
  "message": "string",
  "data": any
}
```

## Error Handling

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **500**: Internal Server Error - Server error

## Notes

- All routes use cookie-based authentication
- File uploads use multipart/form-data
- Technology IDs are required for project creation
- Department updates are restricted to department admins only  
