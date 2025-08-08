<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Logo" width="80" height="80"/>
  <h1>Kolabo</h1>
  <p><em>A modern project management and collaboration platform built with React</em></p>
  
  <div>
    <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
    <img src="https://img.shields.io/badge/TailwindCSS-3.4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  </div>
  
  <br/>
  
  <p>Designed for teams to manage tasks, sprints, and workflows efficiently</p>
</div>

---

## Features

<table>
<tr>
<td width="50%">

### Frontend Technologies
- **React 18** - Latest React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for modern UI design
- **React Router v6** - Declarative routing for single-page application

</td>
<td width="50%">

### Core Features
- **Authentication** - JWT-based authentication with secure login/logout
- **Task Management** - Create, assign, and track tasks with Kanban boards
- **Sprint Planning** - Agile sprint planning with velocity tracking
- **Team Management** - Invite members and manage team permissions

</td>
</tr>
<tr>
<td width="50%">

### Analytics & Insights
- **Real-time Analytics** - Performance insights and project metrics
- **User Profiles** - Complete profile management with photo uploads
- **Session Management** - Track active sessions and device management

</td>
<td width="50%">

### Developer Experience
- **Modern React Patterns** - Hooks, Context API, and functional components
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Component Architecture** - Modular and reusable UI components

</td>
</tr>
</table>

## Prerequisites

<div align="center">

| Requirement | Version | Status |
|-------------|---------|--------|
| Node.js | v14.x or higher | Required |
| npm | Latest | Required |
| Backend API | Port 3000 | Required |

</div>

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd kolabo

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open your browser
# Navigate to http://localhost:4029
```

## Project Structure

```
kolabo/
├── public/             # Static assets and manifest
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/         # UI-specific components (Header, Sidebar, etc.)
│   ├── pages/          # Page components
│   │   ├── dashboard-overview/    # Main dashboard
│   │   ├── kanban-board/         # Task management boards
│   │   ├── sprint-planning/      # Sprint planning tools
│   │   ├── analytics-dashboard/  # Performance analytics
│   │   ├── team-management/      # Team settings
│   │   ├── user-profile/         # User profile management
│   │   └── login-register/       # Authentication pages
│   ├── contexts/       # React context providers (Auth, Toast)
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── styles/         # Global styles and CSS
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routing configuration
│   └── index.jsx       # Application entry point
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.mjs     # Vite build configuration
```

## Key Features

<div align="center">

### Authentication System
JWT-based authentication • Username/email login support • User registration with validation • Session management and tracking

### Project Management
**Dashboard Overview** - Project metrics and activity feed  
**Kanban Boards** - Visual task management with drag-and-drop  
**Sprint Planning** - Agile sprint management with velocity tracking  
**Analytics** - Team performance insights and reporting

### User Management
**Profile Management** - Complete user profile with photo uploads  
**Team Management** - Invite members and manage permissions  
**Session Tracking** - Monitor active sessions across devices

</div>

## API Integration

<div align="center">

**The application integrates with a NestJS backend API**

</div>

### Authentication Endpoints
```http
POST   /api/auth/login           # User login
POST   /api/auth/register        # User registration
POST   /api/auth/logout          # User logout
GET    /api/auth/profile         # Get current user profile
PUT    /api/auth/profile         # Update user profile
POST   /api/auth/profile/photo   # Upload profile photo
DELETE /api/auth/profile/photo   # Remove profile photo
```

### Additional Features
- Session management
- Real-time notifications
- Task and project CRUD operations
- Team collaboration tools

## Environment Setup

<div align="center">

**Important**: Make sure your backend API is running on `http://localhost:3000` before starting the frontend application.

</div>

## Available Scripts

<div align="center">

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |

</div>

## Technology Stack

<div align="center">

<table>
<tr>
<td align="center" width="16.66%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40"/><br/>
<strong>React 18.2.0</strong><br/>
<em>Frontend Framework</em>
</td>
<td align="center" width="16.66%">
<img src="https://vitejs.dev/logo.svg" width="40"/><br/>
<strong>Vite 5.0.0</strong><br/>
<em>Build Tool</em>
</td>
<td align="center" width="16.66%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="40"/><br/>
<strong>TailwindCSS</strong><br/>
<em>Styling</em>
</td>
<td align="center" width="16.66%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40"/><br/>
<strong>JavaScript ES6+</strong><br/>
<em>Programming Language</em>
</td>
<td align="center" width="16.66%">
<strong>Lucide React</strong><br/>
<em>Icons</em>
</td>
<td align="center" width="16.66%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40"/><br/>
<strong>JWT Tokens</strong><br/>
<em>Authentication</em>
</td>
</tr>
</table>

**Architecture**: React Context API • React Router v6 • Fetch API with custom service layer • localStorage

</div>

## Contributing

<div align="center">

**We welcome contributions! Here's how you can help:**

</div>

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

<div align="center">

This project is licensed under the **MIT License**.

---

<p>
  <strong>Built with React</strong><br/>
  <em>Modern • Fast • Scalable</em>
</p>

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Logo" width="30" height="30"/>

</div>
