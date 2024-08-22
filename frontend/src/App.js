import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//importo le varie pagine
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/resetPassword/Forgot';
import ResetPassword from './pages/resetPassword/Reset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
