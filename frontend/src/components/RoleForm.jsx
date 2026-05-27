import { useState, useEffect } from 'react'

export default function RoleForm({ users = [], activeUser, onSubmit }) {
  const [formData, setFormData] = useState({
    roleName: '',
    userId: ''
  })

  useEffect(() => {
    setFormData({
      roleName: '',
      userId: activeUser ? activeUser.id.toString() : ''
    })
  }, [activeUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const assignedUserId = activeUser ? activeUser.id : (formData.userId ? Number(formData.userId) : null)
    
    if (!assignedUserId) {
      alert('Please assign this role to a user.')
      return
    }

    onSubmit({
      roleName: formData.roleName,
      user: { id: assignedUserId }
    })
    
    setFormData({ 
      roleName: '',
      userId: activeUser ? activeUser.id.toString() : ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-transparent text-white p-1">
      <h2 className="text-2xl font-black uppercase text-white border-b border-white/5 pb-3">
        New Role Assignment
      </h2>
      
      {!activeUser && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Assign User</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ed563b]"
          >
            <option value="" disabled>-- Select a User --</option>
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-[#1e1e1e] text-white">
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Role Name</label>
        <input
          type="text"
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          placeholder="e.g. ROLE_ADMIN, ROLE_TRAINER, ROLE_USER"
          required
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300"
      >
        Assign Role
      </button>
    </form>
  )
}
