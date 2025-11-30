<div align="center">
  <h1>💻 Workdate.dev</h1>
  <p><strong>Productive work sessions with your partner or find a coding buddy</strong></p>
  <p>
    <a href="https://workdate-dev.vercel.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 📖 About

**Workdate.dev** is a productivity app designed for developers who want to work together, stay focused, and achieve their goals. Whether you're working with your partner in **Couple Mode** or finding a coding buddy in **Solo Mode**, Workdate.dev helps you stay accountable and productive.

### 🎯 Two Main Modes

1. **💑 Couple Mode** - Work sessions with your partner
   - Create shared work sessions
   - Track tasks together
   - Set secret rewards for motivation
   - Real-time progress visibility

2. **👤 Solo Mode** - Find a coding buddy
   - Browse available work sessions
   - Host your own session
   - Match with developers based on preferences
   - Request to join sessions

---

## ✨ Features

### Couple Mode
- ✅ Create and schedule work sessions
- ✅ Shared task management (My Focus / Partner's Focus)
- ✅ Secret reward system
- ✅ Online/Offline mode support
- ✅ Real-time session tracking

### Solo Mode
- ✅ Browse public work sessions
- ✅ Create detailed session listings
- ✅ Filter by tech stack, level, and vibe
- ✅ Request to join sessions
- ✅ Partner matching system

### General
- 🔐 User authentication (Supabase Auth)
- 👤 User profiles with status
- 🎨 Modern, responsive UI
- 🌙 Dark theme
- 📱 Mobile-friendly design

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HhaMinh0310/workdate.dev.git
   cd workdate.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   Get these values from: **Supabase Dashboard** → **Settings** → **API**

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
workdate.dev/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (Button, etc.)
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── ProtectedRoute.tsx
│   │   └── TaskList.tsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/               # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── couple/         # Couple Mode pages
│   │   └── solo/           # Solo Mode pages
│   ├── services/            # API service layer
│   │   ├── supabase.ts     # Supabase client
│   │   ├── auth.service.ts
│   │   ├── coupleSession.service.ts
│   │   ├── soloSession.service.ts
│   │   └── partnership.service.ts
│   ├── types.ts             # TypeScript type definitions
│   └── App.tsx              # Main app component
├── supabase-schema.sql      # Database schema
├── fix-rls-policy.sql       # RLS policies fix
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json
```

---

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**
   - In Vercel project settings, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will automatically deploy on every push to `main`

### Environment Variables for Production

Make sure to add these in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Detailed Supabase configuration
- [Project Documentation](./Document/readme.md) - Full feature documentation

---

## 🗄️ Database Schema

The app uses Supabase (PostgreSQL) with the following main tables:

- `profiles` - User profiles
- `partnerships` - Couple relationships
- `couple_sessions` - Couple work sessions
- `tasks` - Task items for sessions
- `rewards` - Secret rewards
- `solo_sessions` - Solo session listings
- `session_requests` - Join requests

See `supabase-schema.sql` for the complete schema.

---

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Authentication** via Supabase Auth
- **Environment variables** for sensitive keys
- **Protected routes** for authenticated pages

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com) for backend
- Deployed on [Vercel](https://vercel.com)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ for productive developers</p>
</div>
