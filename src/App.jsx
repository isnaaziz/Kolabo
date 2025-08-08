import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes />
        <ToastContainer />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
