import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function AdminDashboard() {
  const [agents, setAgents] = useState([])
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' })
  const [file, setFile] = useState(null)
  const [uploadInfo, setUploadInfo] = useState(null)
  const [error, setError] = useState('')

  const loadAgents = async () => {
    try {
      const list = await api.get('/api/admin/agents')
      setAgents(list)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { loadAgents() }, [])

  const createAgent = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/admin/agents', form)
      setForm({ name:'', email:'', phone:'', password:'' })
      loadAgents()
    } catch (e) {
      setError(e.message)
    }
  }

  const removeAgent = async (id) => {
    if (!confirm('Remove this agent?')) return
    try { await api.del(`/api/admin/agents/${id}`); loadAgents() } catch (e) { setError(e.message) }
  }

  const uploadFile = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please choose a file')
    setError('')
    try {
      const res = await api.upload('/api/admin/tasks/upload', file)
      setUploadInfo(res)
      alert(`Uploaded successfully. Batch: ${res.batchId} | Total: ${res.total}`)
    } catch (e) {
      setError(e.message || 'Upload failed')
      alert(`Upload failed: ${e.message || 'Unknown error'}`)
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <div style={{color:'crimson', marginBottom:8}}>{error}</div>}

      <div className="card">
        <h3>Create Agent</h3>
        <form onSubmit={createAgent}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <label>Name</label>
              <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
            </div>
            <div>
              <label>Email</label>
              <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
            </div>
            <div>
              <label>Mobile (+Country Code)</label>
              <input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="+91..." />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
            </div>
          </div>
          <button style={{marginTop:8}}>Add Agent</button>
        </form>
      </div>

      <div className="card">
        <h3>Agents</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr>
          </thead>
          <tbody>
            {agents.map(a => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.phone}</td>
                <td><button onClick={()=>removeAgent(a._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Upload CSV/XLS/XLSX Tasks</h3>
        <form onSubmit={uploadFile}>
          <input type="file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          <button style={{marginLeft:8}}>Upload & Distribute</button>
        </form>
        {uploadInfo && (
          <div style={{marginTop:8}}>
            <div><strong>Batch:</strong> {uploadInfo.batchId}</div>
            <div><strong>Total:</strong> {uploadInfo.total}</div>
            <div style={{marginTop:8}}>
              <strong>Per Agent Counts</strong>
              <pre style={{background:'#f9fafb', padding:8}}>{JSON.stringify(uploadInfo.counts, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
