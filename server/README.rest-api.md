# REST API Documentation

## Student Authentication & Management

| Method | Endpoint                      | Description                        | Request Body                | Response                | Auth Required |
|--------|--------------------------------|------------------------------------|-----------------------------|-------------------------|---------------|
| POST   | /students/login               | Student login                      | { userName, password }      | { loggedIn, user, ... } | None          |
| GET    | /students/register            | Get all students (admin only)      | -                           | Array of students       | Instructor    |
| POST   | /students/register            | Register new student               | { userName, ... }           | { message, user }       | None          |
| GET    | /students/register/me         | Get current student info           | - (cookie)                  | { user }                | Student       |
| PUT    | /students/register/me         | Update current student             | { ...fields }               | { message, user }       | Student       |
| DELETE | /students/register/me         | Delete current student             | -                           | { message }             | Student       |
| POST   | /students/register/forgot-password | Request password reset         | { email }                   | { message }             | None          |
| GET    | /students/register/reset-password | Reset password (via link)      | { code, newPassword }       | { message }             | None          |
| GET    | /apiStudent/check-auth      | Check student authentication       | - (cookie)                  | { isAuthenticated, user }| Student       |
| GET    | /apiStudent/external-check-auth | Check auth for external access    | -                           | { isAuthenticated, user }| None          |
| POST   | /apiStudent/logout          | Student logout                     | -                           | { loggedOut, message }  | Student       |

## Instructor Authentication & Management

| Method | Endpoint                             | Description                       | Request Body                                              | Response                            | Auth Required |
|--------|--------------------------------------|-----------------------------------|-----------------------------------------------------------|-------------------------------------|---------------|
| POST   | /instructor/register/administrator   | Register new department admin     | { userName, email, pass, first_name, last_name, phone, department } | { message, success }                | None          |
| POST   | /instructor/login                    | Instructor login                  | { userName, password }                                     | { loggedIn, user, ... }             | None          |
| GET    | /instructor/register                 | Get all instructors (admin only)  | -                                                         | Array of instructors                | Instructor    |
| GET    | /instructor/                         | Check if instructor is admin      | -                                                         | { success: true, isAdmin: boolean } | None          |
| POST   | /instructor/register                 | Register new instructor           | { userName, ... }                                         | { message, user }                   | None          |
| GET    | /instructor/register/me              | Get current instructor info       | - (cookie)                                                | { user }                            | Instructor    |
| PUT    | /instructor/register/me              | Update current instructor         | { ...fields }                                             | { message, user }                   | Instructor    |
| DELETE | /instructor/register/me              | Delete current instructor         | -                                                         | { message }                         | Instructor    |
| POST   | /instructor/register/forgot-password | Request password reset            | { email }                                                 | { message }                         | None          |
| GET    | /instructor/register/reset-password  | Reset password (via link)         | { code, newPassword }                                     | { message }                         | None          |
| GET    | /apiInstructor/check-auth            | Check instructor authentication   | - (cookie)                                                | { isAuthenticated, user }           | Instructor    |
| GET    | /apiInstructor/external-check-auth   | Check auth for external access    | -                                                         | { isAuthenticated, user }           | None          |
| POST   | /apiInstructor/logout                | Instructor logout                 | -                                                         | { loggedOut, message }              | Instructor    |
| GET    | /apiInstructor/checkInstructor/:projectId | Check if instructor is associated with project | - | { success, isProjectInstructor, isAdminOfDepartment } | Instructor |


## Admin Management

| Method | Endpoint               | Description                       | Request Body | Response              | Auth Required |
|--------|------------------------|-----------------------------------|--------------|-----------------------|---------------|
| PUT    | /admin/toggle-status/:id | Toggle instructor active status   | -            | { success, message }  | Admin         |
| GET    | /admin/insByDep        | Get all instructors by department | -            | Array of instructors  | Admin         |
| GET    | /admin/stdByDep        | Get all students by department    | -            | Array of students     | Admin         |
| GET    | /admin/projectsInsByDep | Get projects and instructors by department | - | { projects, instructors } | Admin |
| POST   | /admin/assignProjectInstructor | Assign instructor to project | { projectId, instructorId } | { success, message } | Admin |
| POST   | /admin/:projectId/addStudent | Add student to project | { studentId } | { success, message } | Admin |

## Departments

| Method | Endpoint                        | Description                                      | Request Body                        | Response                | Auth Required |
|--------|---------------------------------|-------------------------------------------------|-------------------------------------|------------------------|---------------|
| GET    | /departments/all                | Get all departments                              | -                                   | { success, message, data: departments } | None           |
| GET    | /departments/                   | Get department info by instructor ID           | - (cookie)                          | { success, message, data: department } | Instructor     |
| GET    | /departments/std                | Get department info by student ID              | - (cookie)                          | { success, message, data: department } | Student        |
| PUT    | /departments/:departmentId      | Update department name by ID (only admin)      | { currentID, newName }              | { success, message }   | Instructor     |

> Note: Only the instructor who is the admin of the department can update the department name.

## Projects

| Method | Endpoint                                      | Description                                      | Request Body          | Response                | Auth Required |
|--------|----------------------------------------------|-------------------------------------------------|-----------------------|-------------------------|---------------|
| GET    | /projects/                                   | Get all projects (role-based)                   | -                     | Array of projects       | Student/Instructor |
| GET    | /projects/:projectId                         | Get a project by ID (role-based)                | -                     | Project object          | Student/Instructor |
| POST   | /projects/                                   | Create a new project (students only)            | Project fields (JSON) | Project object          | Student       |
| PUT    | /projects/:projectId                         | Update a project by ID (students only)          | Project fields (JSON) | Project object          | Student       |
| DELETE | /projects/:projectId                         | Delete a project by ID (students only)          | -                     | 204 No Content          | Student       |
| GET    | /projects/:projectId/technologies            | Get technologies for a project (role-based)     | -                     | Array of technologies   | Student/Instructor |
| GET    | /projects/:projectId/file                    | Get file for a project (role-based)             | -                     | File download           | Student/Instructor |
| GET    | /projects/:projectId/downloadFiles           | Download Word + Signature files (instructor/admin) | - | ZIP file download | Instructor/Admin |

## Technologies

| Method | Endpoint                              | Description                      | Request Body         | Response                | Auth Required |
|--------|----------------------------------------|----------------------------------|----------------------|-------------------------|---------------|
| GET    | /technology/                          | Get all technologies (students) | -                    | { success, data: technologies } | Student |
| GET    | /technology/getAdmin                  | Get all technologies (admin)     | -                    | { success, data: technologies } | Instructor |
| POST   | /technology/                          | Create a new technology          | Technology fields    | { success, message }    | Student |
| PUT    | /technology/:technologyId             | Update a technology by ID        | Technology fields    | { success, message }    | Instructor |
| DELETE | /technology/:technologyId             | Delete a technology by ID        | -                    | { success, message }    | Instructor |

## Email

| Method | Endpoint                              | Description                        | Request Body         | Response                | Auth Required |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|---------------|
| POST   | /Email/                               | Send email                         | Email data            | Email response          | None          |

## Uploads

| Method | Endpoint                              | Description                        | Request Body         | Response                | Auth Required |
|--------|----------------------------------------|------------------------------------|----------------------|-------------------------|---------------|
| POST   | /upload/:projectId/file               | Upload a file for a project       | Multipart/form-data (file, projectTitle) | { success, message, data: { filePath } } | Student |
| POST   | /upload/:projectId/uploadTwoFiles     | Upload file and image for project | Multipart/form-data (file, image) | { success, message } | Student |

## Comments

| Method | Endpoint                          | Description                              | Request Body                                    | Response                               | Auth Required          |
|--------|----------------------------------|----------------------------------------|------------------------------------------------|---------------------------------------|-----------------------|
| GET    | /comments/:commentId            | Get comment by ID (role-based)          | -                                              | { success: true, data: comment }       | Student/Instructor     |
| GET    | /comments/project/:projectId     | Get comments by project ID (role-based) | -                                              | { success: true, data: { doneAndCompleted, doneButNotCompleted, notDone, counts } } | Student/Instructor     |
| GET    | /comments/next/:commentId       | Get next comment by ID (role-based)     | -                                              | { success, message, data: comment }    | Student/Instructor     |
| GET    | /comments/prev/:commentId       | Get previous comment by ID (role-based) | -                                              | { success, data: comment }             | Student/Instructor     |
| POST   | /comments                       | Create a new comment (Instructor only)  | { project_id, title, section, page, text, is_done } | { success: true/false, message: string } | Instructor             |
| PUT    | /comments/:commentId            | Update a comment by ID (Instructor only) | { title, section, page, text, is_done }          | { success: true/false, message: string } | Instructor             |
| PUT    | /comments/isDone/:commentId     | Mark comment as done (role-based)       | -                                              | { success, message }                   | Student/Instructor     |
| PUT    | /comments/:commentId/userDone   | Mark comment done with response (role-based) | { response }                           | { success, message }                   | Student/Instructor     |
| DELETE | /comments/:commentId            | Delete a comment by ID (role-based)     | -                                              | { success: true/false, message: string } | Student/Instructor     |

## Stages

| Method | Endpoint                          | Description                              | Request Body                                    | Response                               | Auth Required          |
|--------|----------------------------------|----------------------------------------|------------------------------------------------|---------------------------------------|-----------------------|
| GET    | /stages/                         | Get all stages by department (admin only) | -                                            | { success: true, data: stages }        | Admin                  |
| POST   | /stages/                         | Add new stage (admin only)              | { name, description, department_id }           | { success: true/false, message: string } | Admin                  |
| PUT    | /stages/:stageId                 | Update stage (admin only)               | { name, description }                          | { success: true/false, message: string } | Admin                  |
| DELETE | /stages/:stageId                 | Delete stage (admin only)               | -                                              | { success: true/false, message: string } | Admin                  |
| GET    | /stages/projectStages/:projectId | Get stages for project (role-based)     | -                                              | { success: true, data: { stages, currentStage } } | Student/Instructor |
| PUT    | /stages/updateProjectStage/:projectId | Update project stage (instructor only) | { stageId }                                    | { success: true/false, message: string } | Instructor             |
| POST   | /stages/approveDocument/:projectId | Approve document (instructor only)      | -                                              | { success: true/false, message: string } | Instructor             |

## Notifications

| Method | Endpoint                          | Description                              | Request Body                                    | Response                               | Auth Required          |
|--------|----------------------------------|----------------------------------------|------------------------------------------------|---------------------------------------|-----------------------|
| GET    | /notifications/                  | Get notifications (role-based)          | -                                              | { success: true, data: notifications } | Student/Instructor     |

---

## Authentication & Authorization

### User Roles
- **Student**: Can create, update, delete their own projects, view comments, upload files
- **Instructor**: Can view projects they're assigned to, create/edit/delete comments, manage project stages
- **Admin**: Can manage all users in their department, assign instructors to projects, manage stages

### Authentication Methods
- **Cookie-based**: Most routes use HTTP-only cookies for authentication
- **JWT Tokens**: Stored in cookies with 1-day expiration
- **Rate Limiting**: Login attempts are rate-limited (6 attempts per 3 minutes)

### Access Control
- **Role-based**: Routes check user role (student/instructor/admin) and department
- **Project Access**: Students can only access their own projects, instructors can access assigned projects
- **Department Isolation**: Users can only access resources within their department
- **Admin Privileges**: Department admins can manage all resources in their department

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

- All routes use cookie-based authentication with JWT tokens
- File uploads use multipart/form-data
- Technology IDs are required for project creation
- Department updates are restricted to department admins only
- Rate limiting is applied to login endpoints (6 attempts per 3 minutes)
- All responses follow a consistent JSON format with success/error indicators
- Role-based access control ensures users can only access appropriate resources
- Department isolation prevents cross-department data access
- Admin users have full control over their department's resources  
