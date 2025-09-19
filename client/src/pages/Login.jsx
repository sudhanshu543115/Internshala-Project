import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('admin@tasker.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      const dest = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/agent')
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'24px auto'}}>
      <h2>Login</h2>
      {error && <div style={{color:'crimson', marginBottom:8}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••" />
        <button disabled={loading} style={{marginTop:8}}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p style={{marginTop:12, color:'#6b7280'}}>Default admin: admin@tasker.com / Admin@123</p>
    </div>
  )
}
