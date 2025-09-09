# LectPro - Final Project Management System

## Project Description

**LectPro** is an advanced final project management system developed as part of a final project at Kinneret College. The system is designed to serve department heads in tracking and managing student final projects in the coming years, providing comprehensive tools for project management, monitoring, and evaluation of academic projects.

## Project Goals

- **Advanced Tracking**: Real-time monitoring of final project progress
- **Efficient Communication**: Two-way feedback system between instructors and students
- **Stage Management**: Definition and management of different project stages
- **Technology Tracking**: Management of technologies and tools used in projects
- **Smart Notifications**: Automatic notification system for important updates
- **Advanced Security**: Role-based permission system

## Key Features

### 👨‍🎓 For Students
- **Project Management**: Create, edit, and delete final projects
- **File Upload**: Upload PDF files, Word documents, and signature images
- **Comment Tracking**: View instructor feedback and submit responses
- **Profile Management**: Update personal details and academic information
- **Notifications**: Receive notifications about updates and new activities

### 👨‍🏫 For Instructors
- **Project Monitoring**: View all assigned projects
- **Comment System**: Add detailed comments on each project stage
- **Stage Management**: Update project stages and approve documents
- **Technology Assessment**: Manage available technologies list
- **Progress Tracking**: Detailed reports on student progress

### 👨‍💼 For Department Heads
- **User Management**: Add, edit, and delete instructors and students
- **Project Assignment**: Link instructors to specific projects
- **Department Management**: Update department names and relevant information
- **Admin Reports**: Detailed statistics on department activity
- **Stage Management**: Define project stages for the entire department

## Technical Architecture

### Frontend (React)
- **React 19.0.0** - Modern UI library
- **React Router DOM** - Page navigation
- **Axios** - Server communication
- **FontAwesome** - Icons
- **SweetAlert2** - Beautiful notifications
- **React-PDF** - PDF file viewing

### Backend (Node.js)
- **Express.js** - Server framework
- **MySQL2** - Relational database
- **JWT** - User authentication
- **Multer** - File upload
- **Nodemailer** - Email sending
- **Rate Limiter** - Request rate limiting

### Security
- **Cookie-based Authentication** - Cookie-based authentication
- **JWT Tokens** - Secure tokens
- **Rate Limiting** - Protection against attacks
- **Role-based Access Control** - Role-based access control
- **Department Isolation** - Isolation between departments

## Installation and Setup

### System Requirements
- Node.js (version 16 and above)
- MySQL (version 8.0 and above)
- npm or yarn


## Project Structure

```
Lectpro/
├── client/                 # Frontend (React)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── base/      # Base components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── logAndRegInstructor/  # Instructor login/registration
│   │   │   ├── logAndRegStudent/     # Student login/registration
│   │   │   └── projects/  # Project components
│   │   ├── css/           # Style files
│   │   └── services/      # Services
│   └── package.json
├── server/                # Backend (Node.js)
│   ├── middleware/        # Middleware functions
│   ├── routers/          # API routes
│   ├── services/         # Services
│   └── server.js         # Main server file
├── documents/            # Project documents
├── images/              # Screenshots
└── README.md           # Basic README file
```

## API Documentation

The system includes a comprehensive API with detailed documentation. For more information see:
- [REST API Documentation](server/README.rest-api.md)

### Main API Examples

**Student Login:**
```http
POST /students/login
Content-Type: application/json

{
  "userName": "student123",
  "password": "password123"
}
```

**Get Projects:**
```http
GET /projects/
Cookie: students=jwt_token
```

**Add Comment:**
```http
POST /comments
Content-Type: application/json
Cookie: instructors=jwt_token

{
  "project_id": 1,
  "title": "Improvement Required",
  "section": "Introduction",
  "page": 5,
  "text": "Please improve the wording",
  "is_done": false
}
```

## Advanced Features

### Smart Comment System
- Detailed comments by section and page
- Tracking comment status (done/not done)
- Two-way responses between instructors and students
- Navigation between comments (next/previous)

### Stage Management
- Custom project stages per department
- Progress tracking through stages
- Document approval at each stage
- Automatic notifications on stage changes

### Notification System
- Real-time notifications for important actions
- Role-based notifications
- Complete notification history

### File Management
- Upload PDF, Word files and images
- View files directly in browser
- Download files as ZIP
- File version management

## Security and Privacy

### Security Protections
- **Password Encryption**: MD5 with Salt
- **JWT Tokens**: Secure authentication with expiration
- **Rate Limiting**: Login attempt limiting
- **CORS Protection**: Protection against cross-origin requests
- **Input Validation**: Strict input validation

### Access Control
- **Distinct Roles**: Student, Instructor, Admin
- **Department Isolation**: Access only to department resources
- **Dynamic Permissions**: Action-specific permissions
- **Continuous Authentication**: Permission checking on every request

## Support and Development

### Development Requirements
- Node.js 16+
- React 19+
- MySQL 8.0+
- Git

### Available Scripts

**Client:**
```bash
npm start          # Start development server
npm run build      # Build production version
npm test           # Run tests
```

**Server:**
```bash
node server.js     # Start server
```

### Contributing to the Project
1. Fork the project
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Additional Documents

- [Database Diagram](Diagrams/db.pdf)
- [Database Diagram 2](Diagrams/db2.pdf)
- [Screenshots](Screenshots%20-%20website%20pages/)

## License

This project was developed as part of a final project at Kinneret College.
Use of this project is permitted only with written approval from the developer.

## Contact

**Project Developer:** Nati Pinyan  
**Email:** natipinyan@gmail.com  
**LinkedIn:** [Nati Pinyan](https://www.linkedin.com/in/nati-pinyan)  
**Institution:** Kinneret College  
**Year:** 2024  
**Field:** Final Project - Software Practical Engineering

---

*This project was developed as part of a final project at Kinneret College with the goal of improving the final project management and tracking process in the department.*
