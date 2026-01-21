# 🎯 MigraTrack Pro - Complete Setup Guide

## 📌 Understanding Your Application Architecture

Your MigraTrack Pro application consists of **THREE main components**:

```
┌─────────────────────────────────────────────────────────────┐
│                    MIGRATRACK PRO                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. FRONTEND (React + TypeScript)                          │
│     📁 Location: Root directory                             │
│     🔧 Running on: http://localhost:5173                    │
│     📦 Storage: Currently using localStorage (temporary)    │
│                                                             │
│  2. BACKEND (ASP.NET Core Web API)                         │
│     📁 Location: Backend/                                   │
│     🔧 Running on: http://localhost:5000                    │
│     📦 Storage: SQL Server Database                         │
│                                                             │
│  3. DATABASE (SQL Server)                                  │
│     📁 Location: DESKTOP-533GP0U                            │
│     🗄️ Database: MigraTrackDB                               │
│     📝 Schema: DatabaseSchema.sql                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 Understanding Connection Strings & API Keys

### ❓ Why is there a Gemini API Key?

The **Gemini API Key** in `.env.local` is there because:
- This project template was created in **Google AI Studio**
- It's used for AI-powered features (optional)
- **NOT related to your SQL database connection**

**You can ignore it or remove it** if you don't need AI features.

### 📍 Where SQL Connection Strings Go

```
Frontend (React)              Backend (C#/.NET)              Database (SQL Server)
┌──────────────┐              ┌──────────────┐              ┌──────────────┐
│              │              │              │              │              │
│ services/    │  HTTP API    │ appsettings  │  SQL Query   │ MigraTrackDB │
│ api.ts       │─────────────▶│ .json        │─────────────▶│              │
│              │              │              │              │              │
│ Calls:       │              │ Connection:  │              │ Tables:      │
│ /api/        │              │ Server=      │              │ Projects     │
│ projects     │              │ DESKTOP-     │              │ Issues       │
│              │              │ 533GP0U      │              │ etc.         │
└──────────────┘              └──────────────┘              └──────────────┘
```

**The SQL connection string goes in:**
- ✅ `Backend/appsettings.json` (already configured!)

## 🚀 Complete Setup Process

### STEP 1: Setup SQL Server Database

#### 1.1 Open SQL Server Management Studio (SSMS)

#### 1.2 Connect to Your SQL Server
- Server: `DESKTOP-533GP0U` (or your server name)
- Authentication: Windows Authentication

#### 1.3 Execute Database Schema
1. File → Open → `DatabaseSchema.sql` (in project root)
2. Press **F5** to execute
3. Verify: Database `MigraTrackDB` is created

**Expected Output:**
```sql
MigraTrack Pro Database Schema Created Successfully!
Database: MigraTrackDB
Total Tables: 16
Total Views: 3
Total Stored Procedures: 3
Total Functions: 1
```

#### 1.4 Verify Tables Created

Run this query in SSMS:
```sql
USE MigraTrackDB;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
```

You should see 16 tables including:
- Users
- Projects
- DataTransferChecks
- VerificationRecords
- MigrationIssues
- CustomizationPoints
- etc.

---

### STEP 2: Configure Backend (.NET API)

#### 2.1 Install .NET 8 SDK
- Download: https://dotnet.microsoft.com/download/dotnet/8.0
- Verify: Run `dotnet --version` (should show 8.x.x)

#### 2.2 Update Connection String (if needed)

Edit `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=MigraTrackDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
  }
}
```

**Common Connection String Formats:**

```json
// Windows Authentication (Default)
"Server=DESKTOP-533GP0U;Database=MigraTrackDB;Trusted_Connection=True;..."

// SQL Server Express
"Server=localhost\\SQLEXPRESS;Database=MigraTrackDB;Trusted_Connection=True;..."

// SQL Authentication
"Server=localhost;Database=MigraTrackDB;User Id=sa;Password=YourPassword;..."

// Remote Server
"Server=192.168.1.100;Database=MigraTrackDB;User Id=admin;Password=Pass123;..."
```

#### 2.3 Run Backend API

Open Terminal in project root:

```bash
cd Backend
dotnet restore
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Now listening on: https://localhost:5001
```

#### 2.4 Test API

Open browser: `https://localhost:5001/swagger`

You should see:
- Swagger UI with all API endpoints
- Try `GET /api/projects` - should return 2 sample projects

---

### STEP 3: Configure Frontend (React)

#### 3.1 Update API Service

Create/Edit `services/api-config.ts`:

```typescript
// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000,
};
```

#### 3.2 Update API Service Implementation

Edit `services/api.ts`:

```typescript
import axios from 'axios';
import { API_CONFIG } from './api-config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectsApi = {
  getAll: () => apiClient.get('/projects'),
  getById: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post('/projects', data),
  update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  getDashboard: (id: string) => apiClient.get(`/projects/${id}/dashboard`),
};

export const dataTransferApi = {
  getByProject: (projectId: string) => 
    apiClient.get(`/datatransfer/project/${projectId}`),
  create: (data: any) => apiClient.post('/datatransfer', data),
  update: (id: string, data: any) => apiClient.put(`/datatransfer/${id}`, data),
};
```

#### 3.3 Run Frontend

```bash
npm run dev
```

Opens at: `http://localhost:5173`

---

### STEP 4: Test Full Stack Integration

#### 4.1 Open Two Terminals

**Terminal 1 - Backend:**
```bash
cd Backend
dotnet run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### 4.2 Verify Integration

1. Open `http://localhost:5173` in browser
2. Click on "Projects" or "Clients"
3. Data should load from SQL Server database (not localStorage)
4. Try creating a new project
5. Verify in SSMS: 
   ```sql
   SELECT * FROM Projects ORDER BY CreatedAt DESC;
   ```

---

## 🗂️ File Structure

```
migratrack-pro/
├── Backend/                          ← NEW .NET API
│   ├── Controllers/
│   │   ├── ProjectsController.cs
│   │   └── DataTransferController.cs
│   ├── Data/
│   │   └── MigraTrackDbContext.cs
│   ├── Models/
│   │   ├── Project.cs
│   │   ├── DataTransferCheck.cs
│   │   └── ...
│   ├── Services/
│   │   └── ProjectService.cs
│   ├── Program.cs
│   ├── appsettings.json             ← SQL CONNECTION STRING HERE
│   └── MigraTrackAPI.csproj
├── services/
│   ├── api.ts                        ← Frontend API calls
│   └── storageService.ts             ← Old localStorage (can replace)
├── DatabaseSchema.sql                ← Run this in SSMS
├── appsettings.json                  ← Old file (can delete)
├── package.json
└── ...
```

---

## 🔧 Troubleshooting

### ❌ Problem: "Cannot connect to SQL Server"

**Solution:**
1. Check if SQL Server service is running
2. Open **SQL Server Configuration Manager**
3. Enable **TCP/IP** protocol
4. Restart SQL Server service
5. Update connection string in `Backend/appsettings.json`

### ❌ Problem: "CORS error in browser console"

**Solution:**
Backend `Program.cs` already has CORS configured:
```csharp
app.UseCors("AllowFrontend");
```

If still issues, check frontend is running on `http://localhost:5173`

### ❌ Problem: "Cannot find /api/projects endpoint"

**Solution:**
1. Verify backend is running: `dotnet run`
2. Check Swagger UI: `https://localhost:5001/swagger`
3. Verify API_BASE_URL in frontend matches backend URL

### ❌ Problem: "Login required' error"

**Solution:**
Database has 2 demo users:
- Username: `admin`, Password: (needs to be hashed properly)
- Username: `demo`

For now, frontend uses mock authentication (localStorage token).

---

## 📊 Database Connection String Locations

| Component | File | Purpose |
|-----------|------|---------|
| **Backend API** | `Backend/appsettings.json` | ✅ SQL Server Connection |
| **Frontend** | `services/api.ts` | ❌ NO SQL - Just API calls |
| **Old Config** | `appsettings.json` (root) | ⚠️ Not used (can delete) |
| **AI Feature** | `.env.local` | Gemini API (optional) |

---

## ✅ Quick Start Checklist

- [ ] SQL Server installed and running
- [ ] Execute `DatabaseSchema.sql` in SSMS
- [ ] Verify `MigraTrackDB` database created
- [ ] .NET 8 SDK installed
- [ ] Update `Backend/appsettings.json` connection string
- [ ] Run `cd Backend && dotnet restore`
- [ ] Run `dotnet run` - Backend starts on port 5000/5001
- [ ] Test Swagger UI: `https://localhost:5001/swagger`
- [ ] Update `services/api.ts` with API endpoints
- [ ] Run `npm run dev` - Frontend starts on port 5173
- [ ] Test full integration: Create a project

---

## 🎓 Summary

**Your Questions Answered:**

1. **Where do I put SQL connection string?**
   → `Backend/appsettings.json` ✅

2. **Why Gemini API Key?**
   → Google AI Studio template feature (optional, can ignore) ✅

3. **How do I connect frontend to database?**
   → Frontend → Backend API → SQL Server
   → Update `services/api.ts` to call `http://localhost:5000/api` ✅

---

## 📞 Need Help?

Check these in order:
1. SQL Server service running?
2. Database `MigraTrackDB` exists?
3. Backend running on port 5000/5001?
4. Swagger UI accessible?
5. Frontend API calls pointing to backend?

Happy coding! 🚀
