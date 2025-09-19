import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function AgentDashboard() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const list = await api.get('/api/agent/tasks')
      setTasks(list)
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h2>My Tasks</h2>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <table>
        <thead>
          <tr><th>First Name</th><th>Phone</th><th>Notes</th><th>Status</th></tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t._id}>
              <td>{t.firstName}</td>
              <td>{t.phone}</td>
              <td>{t.notes}</td>
              <td>{t.status}</td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr><td colSpan={4} style={{textAlign:'center', color:'#6b7280'}}>No tasks yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )}
