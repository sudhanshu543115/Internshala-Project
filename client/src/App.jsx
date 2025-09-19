import React, { useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AgentDashboard from './pages/AgentDashboard.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'

function Layout() {
  const { user, logout, fetchMe } = useAuth()
  const navigate = useNavigate()
  useEffect(() => { fetchMe() }, [])
  return (
    <div>
      <header>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <Link to="/" style={{color:'white',textDecoration:'none',fontWeight:700}}>Task Manager</Link>
          </div>
          <nav>
            <Link to="/">Home</Link>
            {!user && <Link to="/login">Login</Link>}
            {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
            {user && user.role === 'agent' && <Link to="/agent">Agent</Link>}
            {user && <Link to="/profile">Profile</Link>}
            {user && <a href="#" onClick={(e)=>{e.preventDefault(); logout().then(()=>navigate('/'))}}>Logout</a>}
          </nav>
        </div>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}> 
            <Route path="/profile" element={<Profile />} />
            <Route element={<RoleRoute role="admin" />}> 
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route element={<RoleRoute role="agent" />}> 
              <Route path="/agent" element={<AgentDashboard />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}
