import { useState, useEffect } from 'react'

export default function MealForm({ meal, users = [], activeUser, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    calories: '',
    userId: ''
  })

  // Role Parsing
  const userRoles = activeUser?.r?.map(role => role.roleName.toUpperCase()) || []
  const isUser = userRoles.includes('ROLE_USER')
  const isTrainer = userRoles.includes('ROLE_TRAINER')
  const isAdmin = userRoles.includes('ROLE_ADMIN') || !activeUser

  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name || '',
        date: meal.date || new Date().toISOString().split('T')[0],
        calories: meal.calories || '',
        userId: meal.user?.id || ''
      })
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        calories: '',
        userId: isUser ? activeUser.id.toString() : ''
      })
    }
  }, [meal, activeUser, isUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const assignedUserId = isUser ? activeUser.id : (formData.userId ? Number(formData.userId) : null)
    
    if (!assignedUserId) {
      alert('Please assign this meal to a user.')
      return
    }

    onSubmit({
      name: formData.name,
      date: formData.date,
      calories: parseInt(formData.calories, 10),
      user: { id: assignedUserId },
      assignedBy: { id: activeUser.id }
    })
  }

  // Filter users to display only regular members for Trainers/Admins
  const memberUsers = users.filter(u => {
    const roles = u.r?.map(role => role.roleName.toUpperCase()) || []
    return roles.includes('ROLE_USER')
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-transparent text-white p-1">
      <h2 className="text-2xl font-black uppercase text-white border-b border-white/5 pb-3">
        {meal ? 'Edit Meal Details' : 'Log Member Meal'}
      </h2>
      
      {(isAdmin || isTrainer) && (
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Assign Member</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ed563b]"
          >
            <option value="" disabled>-- Select a Member --</option>
            {memberUsers.map(u => (
              <option key={u.id} value={u.id} className="bg-[#1e1e1e] text-white">
                {u.name} (Age: {u.age})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Meal Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Breakfast, Lunch, Post-workout shake"
          required
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Calories (kcal)</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            required
            placeholder="e.g. 500"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300"
      >
        {meal ? 'Update Meal' : 'Log Meal'}
      </button>
    </form>
  )
}
