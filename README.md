# 🎬 StreamFlow - Video Streaming Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge" alt="Vite">
  <img src="https://img.shields.io/badge/Styling-Tailwind-06B6D4?style=for-the-badge" alt="Tailwind">
</p>

A modern, responsive video streaming frontend with adaptive bitrate playback, seamless user experience, and Netflix-inspired design.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **📺 HLS Video Player** | Adaptive streaming with quality selection (360p, 480p, 720p) |
| **🔐 Secure Authentication** | JWT-based login/registration with protected routes |
| **📤 Video Upload** | Drag-and-drop upload with progress tracking |
| **⏯️ Resume Playback** | Continue watching from where you left off |
| **🔍 Search** | Find videos by title |
| **🎨 Netflix-Style UI** | Dark theme, responsive design for all devices |
| **📱 Mobile Responsive** | Works on phones, tablets, and desktops |

---

## 🎨 Design Highlights

- **Hero Banner** - Featured video with large background display
- **Video Cards** - Thumbnail previews with hover effects
- **Progress Indicators** - Watch progress bar on video cards
- **Quality Selector** - Dropdown to switch between 360p/480p/720p
- **Fullscreen Mode** - Immersive viewing experience

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Fast build tool |
| **React Router** | Client-side routing |
| **Axios** | HTTP client |
| **HLS.js** | Video streaming playback |
| **React Icons** | Icon library |

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Video grid, hero banner, continue watching |
| **Login** | `/login` | User authentication |
| **Register** | `/register` | New user registration |
| **Watch** | `/watch/:id` | Video player with controls |
| **Upload** | `/upload` | Video upload interface (protected) |

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| First Contentful Paint | <1.5s |
| Time to Interactive | <3s |
| Bundle Size | Optimized with code splitting |
| Lighthouse Score | 90+ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Running backend API

### Installation

```bash
# Clone the repository
git clone https://github.com/AkashNegi1/streaming-frontend.git
cd streaming-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_R2_URL=https://your-r2-domain.r2.cloudflarestorage.com
```

---

## 🎬 Key Components

### VideoPlayer
- HLS.js integration for adaptive streaming
- Custom controls (play/pause, volume, seek)
- Quality selector dropdown
- Fullscreen toggle
- Keyboard shortcuts

### VideoCard
- Thumbnail display
- Hover preview effect
- Watch progress indicator
- Title truncation

### HeroBanner
- Featured video display
- Gradient overlay
- Play button CTA
- Title and description

### UploadPage
- Drag-and-drop interface
- Upload progress bar
- File validation
- Error handling

---

## 🎯 User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visitor ──▶ Home Page ──▶ Watch Video                         │
│       │                │               │                         │
│       │                │               ▼                         │
│       │                │         Video Player                   │
│       │                │         (HLS Stream)                   │
│       │                │               │                         │
│       ▼                ▼               ▼                         │
│  Register ──▶ Login ──▶ Upload ──▶ Processing ──▶ Play        │
│                           │              │                      │
│                           │              ▼                      │
│                           └─────▶ Watch History Saved           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

| Element | Color |
|---------|-------|
| Background | `#141414` (Netflix dark) |
| Surface | `#1f1f1f` |
| Primary | `#e50914` (Netflix red) |
| Text Primary | `#ffffff` |
| Text Secondary | `#b3b3b3` |
| Accent | `#46d369` (Success green) |

---

## 🌐 Live Demo

**Frontend Live:** [https://streaming-frontend-fsre52kto-akashnegi1s-projects.vercel.app](https://streaming-frontend-fsre52kto-akashnegi1s-projects.vercel.app)

**Backend API:** [https://netflix-backend-production-892d.up.railway.app](https://netflix-backend-production-892d.up.railway.app)

---

## 📂 Project Structure

```
src/
├── api/
│   ├── client.ts       # Axios instance
│   ├── auth.ts         # Auth endpoints
│   └── videos.ts       # Video endpoints
│
├── components/
│   ├── VideoCard.tsx       # Video thumbnail card
│   ├── VideoPlayer.tsx     # HLS video player
│   ├── VideoControls.tsx   # Playback controls
│   ├── QualitySelector.tsx # Quality dropdown
│   ├── HeroBanner.tsx      # Featured video banner
│   └── Navbar.tsx          # Navigation bar
│
├── pages/
│   ├── HomePage.tsx        # Main video grid
│   ├── WatchPage.tsx       # Video player page
│   ├── LoginPage.tsx       # Login form
│   ├── RegisterPage.tsx    # Registration form
│   └── UploadPage.tsx      # Video upload
│
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   ├── useVideos.ts        # Video fetching hook
│   └── useWatchProgress.ts # Progress tracking
│
├── context/
│   └── AuthContext.tsx     # Auth state management
│
├── types/
│   └── index.ts            # TypeScript interfaces
│
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```

---

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📝 License

MIT License - feel free to use this project for learning and personal projects.

---

## 👨‍💻 Author

**Akash Negi**
- GitHub: [@AkashNegi1](https://github.com/AkashNegi1)
- LinkedIn: [akashnegi1](https://linkedin.com/in/akashnegi1)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [HLS.js](https://hlsjs.netlify.app/) - Video streaming
- [React Icons](https://react-icons.github.io/react-icons/) - Icons
- [Netflix](https://netflix.com/) - Design inspiration

---

## 🔗 Related Repositories

| Repository | Description |
|------------|-------------|
| [streaming-backend](https://github.com/AkashNegi1/streaming-backend) | NestJS backend API |

---

<p align="center">
  ⭐ Star this repository if you found it helpful!
</p>