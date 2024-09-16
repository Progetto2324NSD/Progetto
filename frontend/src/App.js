import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//importo le varie pagine
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/Forgot';
import ResetPassword from './pages/Reset';
import Workout from './pages/Workout';
import Stat from './pages/Stat';
import Notifiche from './pages/Notifiche';
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Workout" element={<Workout />} />
          <Route path="/Statistiche" element={<Stat />} />
          <Route path="/Notifiche" element={<Notifiche />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />

        <Route element={<ProtectedRoutes />}>

        </Route>


      </Routes>
    </Router>
  );
}

export default App;
