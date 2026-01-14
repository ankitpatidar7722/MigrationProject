# 🚀 How to Run MigraTrack Pro on Localhost

## ✅ **GOOD NEWS: Your App is Already Running!**

Based on your current terminal status:
- ✅ Frontend is running (48 minutes)
- ✅ Backend is running (12 minutes)

## 🌐 **Access Your Application:**

### **Frontend (Main Application):**
```
http://localhost:5173
```
👆 **Open this in your browser** - This is your React app

### **Backend API:**
```
http://localhost:5000
```

### **API Documentation (Swagger):**
```
https://localhost:5001/swagger
```
👆 **Test your API endpoints here**

---

## 📋 **Quick Start Guide (If Not Running)**

### **Step 1: Start Backend API**

Open Terminal/PowerShell #1:

```powershell
cd c:\Users\hp\Downloads\migratrack-pro\Backend
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Now listening on: https://localhost:5001
```

✅ **Leave this terminal open!**

---

### **Step 2: Start Frontend**

Open Terminal/PowerShell #2:

```powershell
cd c:\Users\hp\Downloads\migratrack-pro
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Leave this terminal open!**

---

### **Step 3: Open in Browser**

1. Open your browser (Chrome/Edge/Firefox)
2. Go to: **http://localhost:5173**
3. You should see the MigraTrack Pro login/dashboard

---

## 🔄 **Managing Your Application**

### **To Stop the Application:**

**Stop Frontend:**
- Go to terminal running `npm run dev`
- Press `Ctrl + C`
- Type `Y` to confirm

**Stop Backend:**
- Go to terminal running `dotnet run`
- Press `Ctrl + C`

### **To Restart:**

Just run the commands again:

**Terminal 1:**
```powershell
cd c:\Users\hp\Downloads\migratrack-pro\Backend
dotnet run
```

**Terminal 2:**
```powershell
cd c:\Users\hp\Downloads\migratrack-pro
npm run dev
```

---

## 🧪 **Verify Everything is Working**

### **Test 1: Check Backend is Running**

Open browser: `http://localhost:5000/api/projects`

You should see JSON with your projects.

### **Test 2: Check Frontend is Running**

Open browser: `http://localhost:5173`

You should see the MigraTrack Pro interface.

### **Test 3: Check Database Connection**

1. Go to `https://localhost:5001/swagger`
2. Find `GET /api/Projects`
3. Click "Try it out" → "Execute"
4. Should return 2 sample projects from database

---

## 🖥️ **Opening Multiple Terminal Windows**

### **Method 1: VS Code Terminal**

1. Open VS Code
2. Press `` Ctrl + ` `` (backtick) to open terminal
3. Click the **+** icon to create new terminal
4. Use **split terminal** icon to view both side-by-side

### **Method 2: Windows Terminal**

1. Open Windows Terminal
2. Press `Ctrl + Shift + T` for new tab
3. Tab 1: Run backend
4. Tab 2: Run frontend

### **Method 3: Separate PowerShell Windows**

1. Open PowerShell window #1 → Run backend
2. Open PowerShell window #2 → Run frontend

---

## 🎯 **Complete Startup Checklist**

- [ ] SQL Server is running
- [ ] Terminal 1: Backend running (`dotnet run`)
- [ ] Terminal 2: Frontend running (`npm run dev`)
- [ ] Browser open to `http://localhost:5173`
- [ ] Can see login/dashboard page
- [ ] Data loads from database (not localStorage)

---

## 🔍 **Troubleshooting**

### ❌ **Problem: "Port 5173 is already in use"**

**Solution:**
```powershell
# Kill the process using port 5173
npx kill-port 5173

# Then restart
npm run dev
```

### ❌ **Problem: "Port 5000 is already in use"**

**Solution:**
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
# Note the PID and kill it:
taskkill /PID <PID_NUMBER> /F

# Then restart backend
dotnet run
```

### ❌ **Problem: "Cannot connect to database"**

**Solution:**
1. Check SQL Server is running:
   - Open **Services** (services.msc)
   - Find "SQL Server (MSSQLSERVER)" or your instance
   - Make sure it's **Running**

2. Check connection string in `Backend/appsettings.json`:
   ```json
   "Server=DESKTOP-533GP0U;Database=MigraTrackDB;..."
   ```

### ❌ **Problem: "Cannot fetch data from API"**

**Solution:**
1. Check backend is running: `http://localhost:5000/api/projects`
2. Check CORS in `Backend/Program.cs` (already configured)
3. Check browser console for errors (F12)

---

## 📱 **Access from Other Devices (Same Network)**

### **Find Your IP Address:**

```powershell
ipconfig
```

Look for "IPv4 Address" (e.g., 192.168.1.100)

### **Update Backend for Network Access:**

Edit `Backend/Program.cs` to add:

```csharp
app.Urls.Add("http://0.0.0.0:5000");
```

### **Update Frontend:**

Run with host flag:

```powershell
npm run dev -- --host
```

### **Access from other devices:**

```
Frontend: http://YOUR_IP:5173
Backend:  http://YOUR_IP:5000
```

---

## 🎓 **Development Workflow**

### **Daily Startup:**

1. **Morning:**
   ```powershell
   # Terminal 1
   cd Backend
   dotnet run
   
   # Terminal 2
   cd ..
   npm run dev
   ```

2. **Open browser:** http://localhost:5173

### **During Development:**

- Frontend auto-reloads on file changes (Hot Module Replacement)
- Backend needs restart after C# code changes
- Database changes need migration

### **End of Day:**

- Press `Ctrl + C` in both terminals
- Commit your changes to Git

---

## 🎯 **Quick Commands Reference**

| Action | Command |
|--------|---------|
| Start Backend | `cd Backend && dotnet run` |
| Start Frontend | `npm run dev` |
| Stop Process | `Ctrl + C` |
| View Frontend | `http://localhost:5173` |
| View API Docs | `https://localhost:5001/swagger` |
| Test API | `http://localhost:5000/api/projects` |
| Kill Port 5173 | `npx kill-port 5173` |
| Kill Port 5000 | `netstat -ano \| findstr :5000` then `taskkill...` |

---

## 🚀 **You're All Set!**

Your application is running at:

🌐 **Frontend:** http://localhost:5173  
🔌 **Backend:** http://localhost:5000  
📚 **API Docs:** https://localhost:5001/swagger  

**Both terminals need to stay open while using the app!**

Enjoy developing with MigraTrack Pro! 🎉
