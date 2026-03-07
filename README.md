# College Course Portal (DBMS Lab Project)

23BCS118 - Ujjawal Maheshwari  
23BCS119 - UmaShankar Kushwaha  
23BCS120 - Urvashi Nandan Doharey  
23BCS121 - Vanma leenasree  





A full-stack course enrollment and allotment system: students register, get approved by admin, view/enroll in courses, and manage preferences; admins manage courses, students, and run allotment.


## How to run the project

**Backend setup:**
cd online_course_portal/backend
npm install
cp .env.example .env
npx tsx scripts/setup-db.ts
npx tsx scripts/seed-departments.ts
npx tsx scripts/seed-admin.ts
npm run dev

**Frontend setup:**
cd online_course_portal/frontend
npm install
npm run dev
