import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// Page imports
import LoginRegister from "./pages/login-register";
import LogoutPage from "./pages/LogoutPage";
import DashboardOverview from "./pages/dashboard-overview";
import TestDashboard from "./pages/TestDashboard";
import KanbanBoard from "./pages/kanban-board";
import SprintPlanning from "./pages/sprint-planning";
import TaskDetail from "./pages/task-detail";
import AnalyticsDashboard from "./pages/analytics-dashboard";
import TeamManagement from "./pages/team-management";
import UserProfile from "./pages/user-profile/UserProfile";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes - no authentication required */}
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* Protected routes - authentication required */}
          <Route
            path="/dashboard-overview"
            element={
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kanban-board"
            element={
              <ProtectedRoute>
                <KanbanBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sprint-planning"
            element={
              <ProtectedRoute>
                <SprintPlanning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-detail"
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics-dashboard"
            element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-management"
            element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Default route - redirect to dashboard (protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;