# Complete Setup & Run Guide

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MySQL/MariaDB** (running on `localhost:3306`)
  - User: `root`
  - Password: `Pokemon@12305` (update in `backend/.env` if different)

## Quick Start (5 minutes)

### 1. Install Dependencies

From the root directory:
```bash
npm run install:all
```

This installs dependencies for root, backend, and frontend.

### 2. Setup Database (First Time Only)

```bash
npm run setup
```

This will:
- Create the `course_allotment` database
- Create all required tables
- Create stored procedures for the application

### 3. Seed Initial Data (First Time Only)

```bash
npm run seed
```

This will:
- Create sample departments (CSE, ECE, EEE, etc.)
- Create admin users
- Populate sample courses
- Set up initial data

### 4. Build the Project

```bash
npm run build
```

### 5. Run the Application

```bash
npm run dev
```

This starts both backend and frontend in development mode:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

---

## Access the Application

### Admin Account
- **Email**: admin@college.com
- **Password**: admin123

### Test Student Account
- **Email**: student@college.com  
- **Password**: student123

### Login URL
http://localhost:5173/login

---

## Running Individual Services

### Backend Only
```bash
npm run dev:backend
```

### Frontend Only
```bash
npm run dev:frontend
```

### Build Backend Only
```bash
npm run build:backend
```

### Build Frontend Only
```bash
npm run build:frontend
```

---

## Database Schema

### Tables
1. **STUDENT** - Student accounts and information
2. **ADMIN** - Admin accounts
3. **COURSE** - Course catalog
4. **DEPARTMENT** - Departments (CSE, ECE, etc.)
5. **PREFERENCE** - Student course preferences (ranked)
6. **ENROLLMENT** - Course allotments (with status: allotted/waitlisted)
7. **COURSE_REQUEST** - Student course requests with approval workflow (NEW)
8. **ADM_IN_ACCESS** - Admin-Course access mapping

### Key Stored Procedures

**Course Requests:**
- `sp_submit_course_request()` - Student submits a course request
- `sp_get_pending_requests()` - Admin views all pending requests
- `sp_approve_course_request()` - Admin approves and auto-enrolls
- `sp_reject_course_request()` - Admin rejects with reason
- `sp_allot_compulsory_course()` - Admin allots course to all eligible students
- `sp_get_available_courses_for_request()` - Get requestable courses for student

---

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Student signup
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Courses (`/courses`)
- `GET /courses` - List courses
- `POST /courses` - Create course (admin)
- `PATCH /courses/:id` - Update course (admin)
- `DELETE /courses/:id` - Delete course (admin)

### Course Requests (`/requests`) - NEW
- `GET /requests` - Get student's own requests
- `POST /requests/:courseId` - Submit course request
- `GET /requests/available/list` - Get available courses to request
- `GET /requests/pending` (admin) - View all pending requests
- `POST /requests/:requestId/approve` (admin) - Approve request
- `POST /requests/:requestId/reject` (admin) - Reject request
- `POST /requests/allot-compulsory/:courseId` (admin) - Allot to all students

### Allotments (`/allotments`)
- `GET /allotments/me` - Get student's allotted courses

### Enrollments (`/enrollments`)
- `GET /enrollments` - Get student's enrollments
- `POST /enrollments/:courseId` - Direct enrollment
- `DELETE /enrollments/:courseId` - Drop course

### Preferences (`/preferences`)
- `GET /preferences` - Get student's preferences
- `POST /preferences/submit` - Submit all preferences

### Admin (`/admin`)
- `GET /admin/students` - List students
- `PATCH /admin/:rollNo/approve` - Approve student
- `PATCH /admin/:rollNo/cgpa` - Update CGPA
- `GET /admin/dashboard/stats` - Dashboard statistics

---

## Workflow Example

### Student Workflow
1. **Signup/Login** → http://localhost:5173/login
2. **Browse Courses** → `/courses`
3. **Set Preferences** → `/preferences` (optional)
4. **View Allotment** → `/allotment` (NEW) - See allotted courses
5. **Request New Courses** → `/allotment` (NEW) - Browse and request
6. **Track Requests** → Same page, see request status
7. **View Enrollments** → `/enrollments` - Confirmed enrollments

### Admin Workflow
1. **Login** → http://localhost:5173/login
2. **Dashboard** → `/admin/dashboard` - View stats
3. **Manage Courses** → `/admin/courses` - CRUD operations
4. **Approve Students** → `/admin/students` - Activate accounts
5. **Manage Requests** → `/admin/allotment` (NEW) - Approve/reject/allot
6. **Allot Compulsory** → `/admin/allotment` - Allot to all eligible

---

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change `PORT` in `backend/.env`
- Change port in `frontend/vite.config.ts`

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL is running
- Check credentials in `backend/.env`
- Verify database `course_allotment` exists

### Build Fails
```bash
# Clean and rebuild
rm -rf backend/dist frontend/dist
npm run build
```

### Can't Login
- Check if admin user was seeded: `npm run seed`
- Use credentials from Seed Initial Data section
- Check browser console for API errors

---

## Development Tips

### Live Reload
- Frontend automatically reloads on file changes
- Backend requires restart to see changes

### Check API Requests
- Open browser DevTools (F12)
- Check Network tab for API calls
- Check Console for error messages

### Database Debugging
```bash
# Connect to MySQL
mysql -u root -p
USE course_allotment;
SELECT * FROM STUDENT;
SELECT * FROM COURSE_REQUEST;
```

---

## Production Deployment

1. Update JWT secrets in `backend/.env`
2. Update database credentials
3. Update `FRONTEND_URL` in `backend/.env`
4. Run: `npm run build`
5. Deploy `frontend/dist` to web server
6. Deploy backend (use PM2, Docker, or similar)

---

## Need Help?

- Check the [main README.md](./README.md)
- Review API endpoint documentation
- Check browser console for errors
- Check backend logs in terminal

---

**Last Updated**: March 28, 2026  
**Course Allotment System v1.0**
