LaunchED - Lead Management System

IMPORTANT : 
ADMIN CREDENTIALS : 
admin@launchedglobal.in
admin123

A full-stack web application for managing student enrollment leads with Google Sheets integration. LaunchED allows students to submit enrollment forms while providing administrators with a dashboard to track, manage, and follow up on leads.

Overview

LaunchED is a lead management system designed for educational institutions to:
- Collect student enrollment information through a user-friendly form
- Store lead data in a PostgreSQL database (Neon Tech)
- Automatically sync leads to Google Sheets for easy tracking
- Provide administrators with a secure dashboard to manage leads
- Track lead status and send automated reminders

Features

Public Features
- **Lead Enrollment Form**: Beautiful, responsive form for students to submit their information
  - Name, Email, Phone (required)
  - Course interest, College, Academic Year (optional)
  - Real-time validation and success/error notifications
  - Modern gradient UI design

Admin Features
- **Secure Admin Login**: JWT-based authentication with bcrypt password hashing
- **Admin Dashboard**: Comprehensive lead management interface
  - **Statistics Overview**: View total leads, new leads, and contacted leads
  - **Lead List**: Display all leads with detailed information
  - **Search Functionality**: Search leads by name or email
  - **Course Filtering**: Filter leads by course interest
  - **Status Management**: Mark leads as "new" or "contacted"
  - **Responsive Design**: Works seamlessly on desktop and mobile devices

Backend Features
- **RESTful API**: Express.js backend with organized routes and controllers
- **Database Integration**: PostgreSQL database using Neon Tech
- **Google Sheets Sync**: Automatic synchronization of leads to Google Sheets
- **Authentication Middleware**: Protected routes for admin endpoints
- **Error Handling**: Comprehensive error handling and validation

Tech Stack

Frontend
- **React 19** - UI library
- **Ionic React 8** - Mobile-first UI components
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **PostgreSQL** - Database (via Neon Tech)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google APIs** - Google Sheets integration

Infrastructure
- **Neon Tech** - PostgreSQL database hosting
- **Google Sheets** - Data synchronization and tracking
- **Render** - Backend hosting (deployed)

Project Structure

```
LaunchED/
├── frontend/                 # React + Ionic frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── LeadForm.tsx  # Main enrollment form
│   │   ├── pages/            # Page components
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── context/          # React context
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Express.js backend
│   ├── config/
│   │   └── db.js            # Database configuration
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   └── leadsController.js
│   ├── database/
│   │   ├── schema.sql       # Database schema
│   │   └── create_admins_table.sql
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   └── leads.js
│   ├── utils/
│   │   └── googleSheets.js  # Google Sheets integration
│   ├── seedAdmin.js        # Admin user seeding script
│   ├── server.js           # Express server
│   ├── package.json
│   └── SETUP_ADMIN.md      # Admin setup instructions
│
└── google-apps-script/      # Google Apps Script for automation
    └── Code.gs             # Automated reminder emails
```

Getting Started

Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon Tech account)
- Google Cloud Project with Sheets API enabled
- Google Service Account credentials

Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhishekRGowd2/LaunchED.git
   cd LaunchED
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

Environment Variables

Backend (.env)
Create a `.env` file in the `backend` directory:

```env
Database
DATABASE_URL=postgresql://neondb_owner:npg_HUc9ZpFYidV7@ep-proud-snow-a1whqbwf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require


# JWT Secret
JWT_SECRET=your-secret-key-here

# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=abhishek@appscript-487805.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRTvc0Jbx8dvAl\nwt0q+gN+utmyjLMdGUyxaU36poY3XT8elk3icX3MFwskPKdO1lviyXe+QmxyAqr9\nKaHgm6nIOr+ASJMl8yNkvzM0DYGpV3cEj7077oKeHrgCI/GwqStha8IXYBXYOome\nLXx7OiiafTCah9NK7Q0F+xgQ6K+Pwgy36cGzjYB1wp91lKkUXvKe0RNkyhgYsHPf\nK/ufXgxcIwNavlA6y4kyX06bBmPZZE9IN9ZWv/ZMb1OY00Nuz9x2RGzpj6hi1lBZ\nfGgiSE7SErNaLmKmQDtkvdNBQKtkcQ24g56pYbkZLnkScYrJK5GBOpo660nvMP1w\nOb4BEKD1AgMBAAECggEADjfzCxPVLg9WWPpX0+eP/TfsOfjc4gkp8JNavMA7Nd+b\nvhQvzkYvaYHXO+ry4qQlMc7F16LjgwszWmdNm9h3PCbhg3FqrZVKvjlO3SZdvIc4\nipLJJB0bumoTzfFrJbkYPVH4qWXZlgrD9n7YifZ1c6k1eAnqDJj13YYlKGDmLDm+\n6J+10oMWCiDqwGGDkUw5+3LWAJVO2shBR+zIEKb6X8jta69BqkHkpdhFHYHuGao2\nD1yI1RvwR7DbcDw5vFtHCfLfJdr1iMr9ZpcDNUizBlobgS6FtnDBegM4j6L9M2mP\nDNB6KcewJFjOxJwL8cro4HnaEWnfsFQGLpD6oiaVsQKBgQD2XqWABcp4qw2BU2qK\nsmp2bcVBP0lMs2YBiX86Cooy2+Kh8MhU2HOMJv18h6jCepQmTY9Ytm6FzneRGwdL\nTT+A4F7NCtH5T4pF4w/0XmEg7snTUhYGY8YpaTOnzMuvOm6TysfBvJi2nzZ2r/Qa\nZVKguc5eRZqY85IBpZjBn1P/pwKBgQDZfXUbmXgECrXB00GVIrbiVZIQDWROQ/2e\nt09fg9ylXC4j92Cg51B2C1RPVA2cGnuIV6mhLuEdeumMm0HZvIgcuPp+BFddb7sC\nUknY88APWed5fQ2dERzr3zVg4feU+2Og5Mppj4ZtMtdmIIuq78I/BHLCGIKKNvrX\nwttW00qOAwKBgQDxBikdNQ0eviFJO0VJCUEUOVG4AmUAb6XErTJVowgOt4VhboFe\nWB+6pk5pLQKRuIAFdO1fGaLIrvPUdr/NEHam61pzeDlxkToyIvBx3n9hS5sRbQX1\nHFk6HByX9cfy1tRlLAX+6DXyu5H5zSufQy7x5LUbDzcumWNmzw3BptDzkwKBgQDE\nZNHXNmJ14+X1PPs/3LUg9PyMmks1kZf4NrfqHHympfLUb5JGOhsiPWDIsbIIgLGE\nkQSQlHCb2l4Dpj90ixauOSuZl/n8WeSZWA1vZ8zLD/hCcHZWmxlutYTSE7sqQUfa\nBj/xyrUs7ngrtL/qf878cNvgAZn/jV4+b6r5YJs2WQKBgBc7CIQNewwPnaNYoxPf\n54uqqJD6/PeLctIJzGu5gjj2IUcGCtT/FzywJN7e8xcJo66Wp0GGSKLBHL2xvP7n\nZezWSPP/INmGLyFn1onknuNPyDj3qatuaGBIrqVL714Y1DwritDz5KdCGgiOFxXz\n5r0izH4+puKnWyPDLk+y8xUa\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_ID=18OFGPlF7RGvFwBcjusKgSeXaMrHFkmx8qk76rxMFRFc

# Server
PORT=5000
NODE_ENV=development
```

Frontend
The frontend is configured to use the deployed backend at `https://launched-backend.onrender.com`. To use a local backend, update the API URLs in:
- `frontend/src/components/LeadForm.tsx`
- `frontend/src/pages/AdminLogin.tsx`
- `frontend/src/pages/AdminDashboard.tsx`

Database Setup

1. **Create the database tables**
   - Log into your Neon Tech dashboard
   - Run the SQL from `backend/database/schema.sql` to create the `leads` table
   - Run the SQL from `backend/database/create_admins_table.sql` to create the `admins` table

2. **Seed an admin user**
   ```bash
   cd backend
   node seedAdmin.js
   ```
   
   Default credentials:
   - Email: `admin@launchedglobal.in`
   - Password: `adminpassword123`
   
   **Change these credentials in production!**

   For detailed instructions, see `backend/SETUP_ADMIN.md`

Google Sheets Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API

2. **Create a Service Account**
   - Navigate to "IAM & Admin" > "Service Accounts"
   - Create a new service account
   - Download the JSON key file
   - Extract `client_email` and `private_key` for your `.env` file

3. **Share Google Sheet**
   - Create a new Google Sheet
   - Share it with the service account email (from step 2)
   - Copy the Sheet ID from the URL and add it to `.env`

4. **Set up Google Apps Script** (Optional)
   - Open your Google Sheet
   - Go to "Extensions" > "Apps Script"
   - Copy the code from `google-apps-script/Code.gs`
   - Set up time-driven triggers for automated reminders

Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   nodemon server.js
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173` (or the port shown in terminal)
   - Backend API: `http://localhost:5000`

API Endpoints

Public Endpoints

Create Lead
```
POST /api/leads
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "course": "React",
  "college": "University Name",
  "year": "2"
}
```

Protected Endpoints (Require JWT Token)

Admin Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "password"
}

Response:
{
  "id": 1,
  "email": "admin@example.com",
  "token": "jwt-token-here"
}
```

Get All Leads
```
GET /api/admin/leads
Authorization: Bearer <token>
Query Parameters:
  - search: string (optional) - Search by name or email
  - course: string (optional) - Filter by course

Response: Array of lead objects
```

Update Lead Status
```
PUT /api/admin/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "contacted"
}
```

Features in Detail

Lead Form
- **Responsive Design**: Works on all device sizes
- **Form Validation**: Real-time validation for required fields
- **Success Feedback**: Toast notifications for successful submissions
- **Error Handling**: Clear error messages for failed submissions
- **Admin Access**: Quick access button to admin login

Admin Dashboard
- **Statistics Cards**: Quick overview of lead metrics
- **Advanced Filtering**: Search and filter capabilities
- **Status Management**: Easy status updates with one click
- **Detailed View**: Complete lead information display
- **Responsive Layout**: Optimized for desktop and mobile

Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication for admin routes
- **Protected Routes**: Middleware protection for sensitive endpoints
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper CORS setup for API security

Testing

Frontend Tests
```bash
cd frontend
npm run test.unit    # Unit tests
npm run test.e2e     # End-to-end tests
npm run lint         # Linting
```

Backend Tests
```bash
cd backend
# Add test scripts as needed
```

Building for Production

Frontend
```bash
cd frontend
npm run build
```
The built files will be in the `dist` directory.

Backend
The backend is ready for production deployment. Ensure:
- Environment variables are set correctly
- Database connection is configured
- Google Sheets credentials are valid

Deployment

Backend Deployment (Render)
1. Connect your repository to Render
2. Set environment variables in Render dashboard
3. Deploy the backend service
4. Update frontend API URLs to point to deployed backend

Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Configure environment variables if needed

Database Schema

Leads Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(255))
- email (VARCHAR(255) UNIQUE)
- phone (VARCHAR(20))
- course (VARCHAR(100))
- college (VARCHAR(255))
- year (VARCHAR(20))
- status (VARCHAR(50) DEFAULT 'new')
- sheet_row_id (INTEGER)
- created_at (TIMESTAMP)
```

Admins Table
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR(255) UNIQUE)
- password (VARCHAR(255))
- created_at (TIMESTAMP)
```

Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

License

This project is licensed under the ISC License.

Authors

- LaunchED Team

Acknowledgments

- Ionic Framework for UI components
- Neon Tech for PostgreSQL hosting
- Google Sheets API for data synchronization

Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Note**: Remember to change default admin credentials before deploying to production!

