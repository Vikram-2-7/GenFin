# GenFin.ai - Complete Startup Guide

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)
1. Double-click `start-genfin.bat`
2. Follow the on-screen instructions
3. GenFin.ai will open automatically in your browser

### Option 2: Manual Startup

## 📋 Prerequisites

### 1. Node.js (Required)
- **Download:** https://nodejs.org/
- **Version:** 18.0 or higher
- **Installation:** Run installer with default settings

### 2. MongoDB (Required)
- **Download:** https://www.mongodb.com/try/download/community
- **Version:** MongoDB Community Server
- **Installation:** 
  - Run installer with default settings
  - Install as a Windows service
  - Start MongoDB service

### 3. Ollama (Required for AI Features)
- **Download:** https://ollama.com/
- **Installation:** 
  - Run installer
  - Ollama will start automatically

## 🔧 Manual Setup Steps

### Step 1: Install Dependencies

#### Backend Dependencies
```bash
cd genfin-backend
npm install
```

#### Frontend Dependencies
```bash
cd ..
npm install
```

### Step 2: Start Services

#### 1. Start MongoDB
- Windows: Start "MongoDB" service from Services
- Or run: `net start MongoDB`

#### 2. Start Ollama
```bash
ollama serve
```

#### 3. Pull AI Model (One-time setup)
```bash
ollama pull mistral
```

#### 4. Start Backend Server
```bash
cd genfin-backend
node server.js
```

#### 5. Start Frontend Development Server
```bash
cd ..
npm run dev
```

## 🌐 Access Points

Once all services are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Ollama API:** http://localhost:11434
- **MongoDB:** mongodb://127.0.0.1:27017/genfin

## 🛠️ Troubleshooting

### Common Issues

#### 1. "MongoDB Not Connected"
- **Solution:** Start MongoDB service
- **Command:** `net start MongoDB`

#### 2. "Ollama Not Available"
- **Solution:** Install and start Ollama
- **Commands:**
  ```bash
  ollama serve
  ollama pull mistral
  ```

#### 3. "Port Already in Use"
- **Solution:** Kill processes using the ports
- **Commands:**
  ```bash
  # Kill Node.js processes
  taskkill /F /IM node.exe
  
  # Kill processes on specific ports
  netstat -ano | findstr :5000
  taskkill /F /PID <PID>
  ```

#### 4. "Module Not Found"
- **Solution:** Install dependencies
- **Commands:**
  ```bash
  cd genfin-backend
  npm install
  
  cd ..
  npm install
  ```

## 📱 Application Features

### Core Functionality
- ✅ **Financial Profile Management**
- ✅ **AI-Powered Chatbot** (with Ollama Mistral)
- ✅ **Investment Planning** with Government Schemes
- ✅ **Financial Health Analysis**
- ✅ **Chat Persistence** (localStorage)

### Key Pages
- **Home:** Landing page and overview
- **Profile:** Financial data entry and analysis
- **Chat:** AI-powered financial assistant
- **Investments:** Investment guidance and schemes
- **Schemes:** Government financial schemes
- **Education:** Financial learning resources

## 🔍 Verification

### Check if Everything is Working

1. **Frontend Loads:** Visit http://localhost:5173
2. **Backend Health:** Visit http://localhost:5000/api/health
3. **Ollama Status:** Visit http://localhost:11434/api/tags
4. **Chatbot Test:** 
   - Go to Chat page
   - Type "hello"
   - Should get friendly response

## 📝 Development Notes

### Project Structure
```
GenFin v3/project/
├── src/                    # Frontend (React + TypeScript)
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   └── App.tsx            # Main app component
├── genfin-backend/         # Backend (Node.js + Express)
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   └── server.js           # Backend server
└── start-genfin.bat       # Automated startup script
```

### Key Technologies
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI:** Ollama with Mistral model
- **Database:** MongoDB

### Environment Variables
Backend uses `.env` file in `genfin-backend/`:
```
MONGO_URI=mongodb://127.0.0.1:27017/genfin
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

## 🚀 Production Deployment

For production deployment:

1. **Build Frontend:**
   ```bash
   npm run build
   ```

2. **Configure Production Variables:**
   - Update MongoDB connection string
   - Set production environment
   - Configure HTTPS

3. **Deploy Services:**
   - Frontend to web server (Nginx/Apache)
   - Backend to Node.js server
   - MongoDB to database server
   - Ollama to dedicated server

## 📞 Support

### Getting Help
1. Check this guide first
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Verify all services are running

### Common Commands
```bash
# Restart everything
taskkill /F /IM node.exe
start-genfin.bat

# Check services
net start | findstr MongoDB
tasklist | findstr ollama
netstat -an | findstr :5000
netstat -an | findstr :5173
```

---

**🎉 Congratulations! Your GenFin.ai financial assistant is now ready to use!**
