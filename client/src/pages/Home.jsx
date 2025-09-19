import React from 'react'

export default function Home() {
  return (
    <div>
      <div className="card">
        <h2>Welcome to Task Manager</h2>
        <p>
          This is a MERN stack project with Admin and Agent roles. Admin can create agents,
          upload CSV/XLS/XLSX files with tasks, and tasks are distributed equally among agents.
          Agents can login to view their assigned tasks and manage their profile.
        </p>
      </div>
      <div className="card">
        <h3>CSV/XLSX Format</h3>
        <pre style={{background:'#f9fafb',padding:'12px',overflow:'auto'}}>
FirstName,Phone,Notes
Rahul,+919876543210,Follow up
Aisha,+971501234567,High priority
John,+14155552671,Call after 2PM
        </pre>
      </div>
    </div>
  )
}
