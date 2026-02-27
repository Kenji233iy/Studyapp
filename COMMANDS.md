# StudyFlow - Quick Commands Reference

## 🚀 Getting Started

```bash
# Clone/navigate to project
cd /workspaces/Studyapp

# Install ALL dependencies (root + frontend + backend)
npm install && cd frontend && npm install && cd ../backend && npm install && cd ..

# Create .env.local files with your Supabase credentials
echo "VITE_SUPABASE_URL=your_value" > frontend/.env.local
echo "NEXT_PUBLIC_SUPABASE_URL=your_value" > backend/.env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your_value" >> backend/.env.local
echo "ANTHROPIC_API_KEY=sk-ant-..." >> backend/.env.local

# Run development servers
npm run dev
# → Frontend: http://localhost:5173
# → Backend: http://localhost:3000
```

## 🔧 Development Commands

```bash
# Only front end
cd frontend && npm run dev

# Only backend
cd backend && npm run dev

# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Type check
cd frontend && npx tsc --noEmit

# Lint (if configured)
npm run lint -w frontend
npm run lint -w backend
```

## 🗄️ Supabase Setup

```bash
# Create Supabase project at https://supabase.com
# Go to SQL Editor → New Query
# Copy-paste entire database.sql file
cat database.sql

# Create storage bucket
# Settings → Storage → New bucket → Name: "pdfs" → Private

# Get credentials
# Settings → API → Copy:
# - Project URL (SUPABASE_URL)
# - Anon Key (SUPABASE_ANON_KEY)
# - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
```

## 🧪 Testing

```bash
# Test frontend build
cd frontend && npm run build && npm run preview

# Test backend
curl -X POST http://localhost:3000/api/analyze-pdf \
  -H "Content-Type: application/json" \
  -d '{"documentId": "test-id"}'

# Check Supabase connection
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/documents
```

## 📁 Project Navigation

```bash
# Navigate to frontend
cd frontend

# Navigate to backend  
cd backend

# Go back to root
cd /workspaces/Studyapp
# or
cd ../
```

## 🚀 Deployment

```bash
# Deploy frontend to Vercel
cd frontend
vercel deploy

# Deploy backend to Vercel
cd backend
vercel deploy

# Or use GitHub integration (automatic)
git push origin main
```

## 💾 Database

```bash
# Export database
pg_dump postgres://user:pass@db.supabase.co/postgres > backup.sql

# View tables in SQL editor
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';

# Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'documents';

# View user's data
SELECT * FROM documents 
WHERE user_id = 'your-user-id'
LIMIT 10;
```

## 📝 File Locations

```bash
# Frontend source
frontend/src/

# Frontend pages
frontend/src/pages/

# Frontend components
frontend/src/components/

# Frontend state (Zustand)
frontend/src/stores/

# Backend API routes
backend/app/api/

# Database schema
database.sql

# Environment examples
.env.example
frontend/.env.example
backend/.env.example

# Documentation
README.md           # Overview
SETUP.md           # Setup guide
ARCHITECTURE.md    # System design
API_REFERENCE.md   # Endpoints
PROJECT_SUMMARY.md # This summary
```

## 🔐 Environment Variables

```bash
# Create frontend/.env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Create backend/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-v0-xxxxx
```

## 🎯 Common Tasks

```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install && cd frontend && npm install && cd ../backend && npm install && cd ..

# Force update dependencies
npm update

# Check npm versions
npm list react react-dom zustand

# View package.json dependencies
npm list --depth=0

# Audit security
npm audit

# Fix security vulnerabilities
npm audit fix

# View file tree
tree -L 2 -I 'node_modules|.next|dist'
# or
find . -maxdepth 2 -type d -not -path '*/node_modules*'
```

## 🐛 Debugging

```bash
# Check if ports are in use
lsof -i :5173  # Frontend
lsof -i :3000  # Backend

# Kill process using port
kill -9 PID

# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Check Supabase connection
curl -I https://your-project.supabase.co
```

## 📊 Monitoring

```bash
# Watch for changes in frontend
cd frontend && npm run dev -- --host

# Watch for changes in backend
cd backend && npm run dev

# Monitor file changes
ls -la src/pages/

# Check database queries (in Supabase dashboard)
# → Logs → Query Performance

# Check API errors (in Supabase dashboard)
# → Logs → Edge Function Logs
```

## 🔄 Git Workflow

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "feat: add PDF upload component"

# Push
git push origin main

# View logs
git log --oneline -10

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard changes
git checkout -- .
```

## 📚 Documentation Quick Links

```bash
# View README
cat README.md | less

# View setup guide
cat SETUP.md | less

# View API reference
cat API_REFERENCE.md | less

# View architecture
cat ARCHITECTURE.md | less

# View this file
cat COMMANDS.md | less
```

## ⚡ Performance Tips

```bash
# Analyze bundle size (frontend)
cd frontend && npm run build

# Check build output
ls -lh frontend/dist/

# Optimize images
# → Use next/image or react-pdf built-in compression

# Check database indexes
SELECT * FROM pg_indexes WHERE tablename IN ('documents', 'flashcards');

# Monitor API response time
curl -w "@-" -o /dev/null -s -X POST http://localhost:3000/api/analyze-pdf

# Profile React components
# → React DevTools Extension
# → Profiler tab → Record
```

## 🎨 Style Development

```bash
# Check Tailwind classes
grep -r "className=" frontend/src/ | head -20

# View CSS variables
grep -E "^  --" frontend/src/index.css

# Find unused styles
# → Use Tailwind CSS IntelliSense extension

# Update theme colors
# → Edit frontend/src/index.css (CSS variables)
# → Changes auto-reload with Vite
```

## 📦 Dependency Management

```bash
# Add new package to frontend
cd frontend && npm install package-name

# Add dev dependency to backend
cd backend && npm install -D @types/node

# Update specific package
npm update package-name

# Remove unused package
npm uninstall package-name

# Check outdated packages
npm outdated

# View dependency tree
npm list --all
```

## 🚢 Deploy Checklist

```bash
# Before deploying:
[ ] npm run build (no errors)
[ ] All tests passing
[ ] Environment variables set
[ ] Database migrations applied
[ ] API endpoints tested
[ ] No console.log() statements left
[ ] Performance optimized
[ ] Mobile responsive checked

# Deploy frontend
cd frontend && vercel deploy

# Deploy backend
cd backend && vercel deploy

# Verify deployment
curl https://your-domain.vercel.app
```

## 🆘 Troubleshooting

```bash
# Port already in use?
# Frontend (5173):
lsof -i :5173 && kill -9 <PID>

# Backend (3000):
lsof -i :3000 && kill -9 <PID>

# Dependencies not installing?
npm cache clean --force && npm install

# Build errors?
rm -rf dist/
npm run build

# Environment not loading?
cat frontend/.env.local
cat backend/.env.local

# Database not connecting?
# → Check Supabase URL is correct
# → Check RLS policies are enabled
# → Test with SQL Editor

# Supabase Auth not working?
# → Check anon key is correct
# → Check Auth Providers are enabled (Settings → Auth)
# → Check Redirect URLs are configured
```

## 💬 Useful Git Commands

```bash
# See what changed
git diff

# Unstage file
git reset HEAD file-name

# Revert file
git checkout -- file-name

# Squash commits
git rebase -i HEAD~3

# Create new branch
git checkout -b feature/my-feature

# Switch branch
git checkout main

# Delete branch
git branch -d feature/old-feature

# Merge branch
git merge feature/my-feature
```

---

## 📞 Quick Support

- **React Questions:** https://react.dev
- **Next.js Issues:** https://nextjs.org/docs
- **Supabase Help:** https://supabase.com/docs
- **Claude API:** https://docs.anthropic.com
- **Tailwind:** https://tailwindcss.com/docs

## ⏱️ Est. Time Breakdown

- Installation: 2 min
- Supabase setup: 5 min
- First run: 1 min
- Full integration: 3-5 days

---

**v1.0 - Quick Reference Complete**
