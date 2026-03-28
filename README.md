# College Course Portal (DBMS Lab Project)

23BCS118 - Ujjawal Maheshwari  
23BCS119 - UmaShankar Kushwaha  
23BCS120 - Urvashi Nandan Doharey  
23BCS121 - Vanma leenasree  





A complete course allotment system for colleges: students request courses, admins approve requests or allot compulsory courses, and the system manages the entire enrollment workflow.

## Features

### Student Features
- **View Allotted Courses**: See all courses allotted by admins (core and elective)
- **Request Courses**: Browse available courses and submit course requests
- **Track Requests**: Monitor status of course requests (pending/approved/rejected)
- **Manage Preferences**: Set course preferences and rankings
- **View Enrollments**: See all enrolled courses with details

### Admin Features
- **Manage Requests**: Review and approve/reject student course requests
- **Allot Compulsory Courses**: Automatically allot core courses to all eligible students in a department
- **Manage Courses**: Create, edit, and manage course catalog
- **Manage Students**: Approve students, update CGPA, view student information
- **Dashboard**: View system statistics and utilization metrics

## How to Run the Project

### Option 1: From Root Directory (Recommended)

```bash
# Install all dependencies
npm run install:all

# Setup database (first time only)
npm run setup

# Seed initial data (first time only)
npm run seed

# Build the project
npm run build

# Run both backend and frontend in development mode
npm run dev
```

### Option 2: Run Backend and Frontend Separately

**Backend Setup:**
```bash
cd backend
npm install
npx tsx scripts/setup-db.ts
npx tsx scripts/seed-departments.ts
npx tsx scripts/seed-admin.ts
npm run dev
```

**Frontend Setup (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
online_course_portal/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.ts           # Main application entry
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.ts        # Authentication
│   │   │   ├── courses.ts      # Course management
│   │   │   ├── requests.ts     # Course requests (NEW)
│   │   │   ├── allotments.ts   # Student allotment view
│   │   │   ├── enrollments.ts  # Enrollment management
│   │   │   ├── preferences.ts  # Course preferences
│   │   │   └── admin.ts        # Admin operations
│   │   ├── config/            # Database and constants
│   │   ├── lib/               # utilities (auth, allotment logic)
│   │   └── middleware/        # Auth middleware
│   └── scripts/               # Database setup and seeding
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── StudentAllotment.tsx      # NEW - Student course view
│   │   │   ├── AdminAllotmentManagement.tsx  # NEW - Admin management
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AvailableCourses.tsx
│   │   │   ├── MyPreferences.tsx
│   │   │   ├── MyEnrollments.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminStudents.tsx
│   │   │   └── AdminCourses.tsx
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context (Auth, etc)
│   │   └── lib/               # API client utilities
│   └── public/                # Static assets
│
└── package.json              # Root orchestration scripts
