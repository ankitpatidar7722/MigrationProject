# MigraTrack Pro - Backend Setup Guide

## 📋 Prerequisites

1. **.NET 8 SDK** - Download from https://dotnet.microsoft.com/download
2. **SQL Server** (SQL Server 2019 or later)
3. **SQL Server Management Studio (SSMS)** or Azure Data Studio

## 🗄️ Database Setup

### Step 1: Create the Database

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance: `DESKTOP-533GP0U`
3. Open the `DatabaseSchema.sql` file (located in project root)
4. Execute the entire script (F5)
   - This will create the `MigraTrackDB` database with all tables, views, stored procedures, and seed data

### Step 2: Verify Database Connection

Your connection string is already configured in `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-533GP0U;Database=MigraTrackDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
  }
}
```

**Note:** Update the `Server` name if your SQL Server instance name is different.

## 🚀 Running the Backend

### Step 1: Navigate to Backend Directory

```bash
cd Backend
```

### Step 2: Restore NuGet Packages

```bash
dotnet restore
```

### Step 3: Run the API

```bash
dotnet run
```

The API will start at:
- **HTTP:** `http://localhost:5000`
- **HTTPS:** `https://localhost:5001`
- **Swagger UI:** `https://localhost:5001/swagger`

## 🔗 Connecting Frontend to Backend

### Step 1: Update Frontend API Configuration

Edit `services/api.ts` to point to your backend:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Projects
  getProjects: () => axios.get(`${API_BASE_URL}/projects`),
  getProject: (id: string) => axios.get(`${API_BASE_URL}/projects/${id}`),
  createProject: (data: any) => axios.post(`${API_BASE_URL}/projects`, data),
  
  // Data Transfer Checks
  getTransferChecks: (projectId: string) => 
    axios.get(`${API_BASE_URL}/datatransfer/project/${projectId}`),
  
  // ... etc
};
```

### Step 2: Run Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd Backend
dotnet run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📊 Database Schema Overview

### Core Tables:
- **Users** - Authentication and user management
- **Projects** - Client projects
- **ModuleGroups** - Module categories (1001-1004)
- **FieldMaster** - Dynamic field definitions

### Module Tables:
- **DataTransferChecks** - Migration tracking
- **VerificationRecords** - Validation records
- **MigrationIssues** - Bug tracking
- **CustomizationPoints** - Custom requirements

### Supporting Tables:
- **Comments** - Attach notes to any entity
- **Attachments** - File uploads
- **ActivityLog** - Audit trail
- **LookupData** - Dropdown values

## 🔑 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/dashboard` - Get dashboard stats

### Data Transfer
- `GET /api/datatransfer/project/{projectId}` - Get checks by project
- `POST /api/datatransfer` - Create check
- `PUT /api/datatransfer/{id}` - Update check

## 🔧 Troubleshooting

### SQL Server Connection Issues

If you get connection errors:

1. **Enable TCP/IP in SQL Server Configuration Manager**
2. **Check Windows Firewall** - Allow SQL Server port 1433
3. **Update connection string** in `appsettings.json`:

```json
// For SQL Express
"Server=localhost\\SQLEXPRESS;Database=MigraTrackDB;..."

// For named instance
"Server=YOUR_COMPUTER_NAME\\INSTANCE_NAME;Database=MigraTrackDB;..."

// Using SQL Authentication
"Server=localhost;Database=MigraTrackDB;User Id=sa;Password=YourPassword;..."
```

### CORS Issues

If frontend can't connect to backend, verify CORS is enabled in `Program.cs`:

```csharp
app.UseCors("AllowFrontend");
```

## 📝 Sample Data

The database includes sample data:
- 2 sample projects (Globex Corp, Soylent Corp)
- 3 transfer checks
- 2 demo user accounts
- Lookup data for all dropdowns

## 🎯 Next Steps

1. ✅ Execute `DatabaseSchema.sql` in SSMS
2. ✅ Run `dotnet run` in Backend directory
3. ✅ Update frontend API service
4. ✅ Test at `https://localhost:5001/swagger`

## 📞 Support

For issues, check:
- SQL Server is running
- Database `MigraTrackDB` exists
- Backend is running on port 5000/5001
- Frontend CORS is configured correctly
