# ⚡ Quick Reference - Connection String & API Key

## 🎯 TL;DR - Your Questions Answered

### Q1: Where do I put my SQL connection string?

**Answer:** `Backend/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-533GP0U;Database=MigraTrackDB;Trusted_Connection=True;..."
  }
}
```

---

### Q2: Why is there a Gemini API Key?

**Answer:** Your project was created in Google AI Studio, which includes AI features.

**This API key is OPTIONAL and NOT needed for your database!**

Located in: `.env.local` (gitignored file)

```
GEMINI_API_KEY=your_gemini_key_here  ← For AI features only (optional)
```

---

## 🔌 How Everything Connects

```
┌──────────────────────────────────────────────────────────────────┐
│                     CONNECTION FLOW                               │
└──────────────────────────────────────────────────────────────────┘

1. FRONTEND (React)
   📍 Location: Root directory
   📝 File: services/api.ts
   🔗 Calls: http://localhost:5000/api/projects
   ❌ NO SQL connection string here!
         │
         │ HTTP Request
         ▼
2. BACKEND (.NET API)
   📍 Location: Backend/ folder
   📝 File: Backend/appsettings.json
   🔗 Connection: Server=DESKTOP-533GP0U;Database=MigraTrackDB;...
   ✅ SQL connection string HERE!
         │
         │ SQL Query
         ▼
3. DATABASE (SQL Server)
   📍 Location: SQL Server Instance
   🗄️ Name: MigraTrackDB
   📊 Tables: Projects, Issues, DataTransferChecks, etc.
```

---

## 📋 Configuration Files Quick Reference

| File | What It Does | Contains |
|------|--------------|----------|
| `Backend/appsettings.json` | ✅ Backend config | **SQL Connection String** |
| `.env.local` | AI features | Gemini API Key (optional) |
| `services/api.ts` | Frontend API | Backend URL endpoints |
| `DatabaseSchema.sql` | Database setup | SQL tables & data |

---

## 🚀 3-Step Startup

### 1️⃣ Create Database
```sql
-- In SQL Server Management Studio (SSMS)
-- Open and run: DatabaseSchema.sql
```

### 2️⃣ Start Backend
```bash
cd Backend
dotnet run
# Runs on http://localhost:5000
```

### 3️⃣ Start Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Connection String Examples

### Windows Authentication (Recommended)
```json
"Server=DESKTOP-533GP0U;Database=MigraTrackDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
```

### SQL Server Express
```json
"Server=localhost\\SQLEXPRESS;Database=MigraTrackDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
```

### SQL Authentication
```json
"Server=localhost;Database=MigraTrackDB;User Id=sa;Password=YourPassword;MultipleActiveResultSets=true;TrustServerCertificate=True;"
```

---

## 🎯 What You Need vs What's Optional

### ✅ REQUIRED (for database to work):
1. SQL Server installed
2. `DatabaseSchema.sql` executed
3. `Backend/appsettings.json` with correct connection string
4. .NET 8 SDK installed
5. Backend running (`dotnet run`)

### ⚪ OPTIONAL (can ignore):
1. `.env.local` / Gemini API Key - Only for AI features
2. Google AI Studio - Project template source

---

## 📞 Still Confused?

Read the full guide: `SETUP_GUIDE.md`

**Remember:**
- **SQL connection string** → `Backend/appsettings.json` ✅
- **Gemini API key** → `.env.local` (optional, for AI features) ⚪
- Frontend talks to Backend via HTTP, NOT directly to database 🔄
