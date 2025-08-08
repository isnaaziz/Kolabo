# Kolabo

A modern project management and collaboration platform built with React, designed for teams to manage tasks, sprints, and workflows efficiently.

## Features

- **React 18** - Latest React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for modern UI design
- **React Router v6** - Declarative routing for single-page application
- **Authentication** - JWT-based authentication with secure login/logout
- **Task Management** - Create, assign, and track tasks with Kanban boards
- **Sprint Planning** - Agile sprint planning with velocity tracking
- **Team Management** - Invite members and manage team permissions
- **Real-time Analytics** - Performance insights and project metrics
- **User Profiles** - Complete profile management with photo uploads
- **Session Management** - Track active sessions and device management

## Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Backend API server running on port 3000

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kolabo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4029`

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

### Authentication System
- JWT-based authentication
- Username/email login support
- User registration with validation
- Session management and tracking

### Project Management
- **Dashboard Overview** - Project metrics and activity feed
- **Kanban Boards** - Visual task management with drag-and-drop
- **Sprint Planning** - Agile sprint management with velocity tracking
- **Analytics** - Team performance insights and reporting

### User Management
- **Profile Management** - Complete user profile with photo uploads
- **Team Management** - Invite members and manage permissions
- **Session Tracking** - Monitor active sessions across devices

## API Integration

The application integrates with a NestJS backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/profile/photo` - Upload profile photo
- `DELETE /api/auth/profile/photo` - Remove profile photo

### Additional Features
- Session management
- Real-time notifications
- Task and project CRUD operations
- Team collaboration tools

## Environment Setup

Make sure your backend API is running on `http://localhost:3000` before starting the frontend application.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build

## Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: TailwindCSS with custom design system
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Fetch API with custom service layer
- **Authentication**: JWT tokens with localStorage
- **Icons**: Lucide React icon library

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
