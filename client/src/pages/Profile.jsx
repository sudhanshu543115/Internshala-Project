import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', phone:'', role:'' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', role: user.role || '' })
  }, [user])

  const save = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const updated = await api.put('/api/agent/profile', { name: form.name, phone: form.phone })
      setUser(updated)
      setMsg('Profile updated')
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:520}}>
      <h2>Profile</h2>
      <form onSubmit={save}>
        <label>Name</label>
        <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <label>Email</label>
        <input value={form.email} disabled />
        <label>Mobile (+Country Code)</label>
        <input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
        <label>Role</label>
        <input value={form.role} disabled />
        <button style={{marginTop:8}}>Save</button>
      </form>
      {msg && <p style={{marginTop:8}}>{msg}</p>}
    </div>
  )
}
