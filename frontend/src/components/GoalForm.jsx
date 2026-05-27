import { useState, useEffect } from 'react'

export default function GoalForm({ goal, users = [], goals = [], activeUser, onSubmit }) {
  const [formData, setFormData] = useState({
    targetWeight: '',
    targetCalories: '',
    deadline: '',
    userId: ''
  })

  // Role Parsing
  const userRoles = activeUser?.r?.map(role => role.roleName.toUpperCase()) || []
  const isUser = userRoles.includes('ROLE_USER')
  const isAdmin = userRoles.includes('ROLE_ADMIN') || !activeUser
  const isTrainer = userRoles.includes('ROLE_TRAINER')

  useEffect(() => {
    if (goal) {
      setFormData({
        targetWeight: goal.targetWeight || '',
        targetCalories: goal.targetCalories || '',
        deadline: goal.deadline || '',
        userId: goal.user?.id || ''
      })
    } else {
      setFormData({
        targetWeight: '',
        targetCalories: '',
        deadline: '',
        userId: isUser ? activeUser.id.toString() : ''
      })
    }
  }, [goal, activeUser, isUser])

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
      alert('Please assign this goal to a member.')
      return
    }

    const submitData = {
      targetWeight: parseFloat(formData.targetWeight),
      targetCalories: parseInt(formData.targetCalories, 10),
      deadline: formData.deadline,
      user: { id: assignedUserId }
    }
    
    onSubmit(submitData)
  }

  // Filter users to display only regular members for Trainers/Admins who do not already have a goal set
  const memberUsers = users.filter(u => {
    const roles = u.r?.map(role => role.roleName.toUpperCase()) || []
    const isMember = roles.includes('ROLE_USER')
    const hasGoalAlready = goals.some(g => g.user?.id === u.id)
    const isCurrentlyAssigned = goal && goal.user?.id === u.id
    return isMember && (!hasGoalAlready || isCurrentlyAssigned)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-transparent text-white p-1">
      <h2 className="text-2xl font-black uppercase text-white border-b border-white/5 pb-3">
        {goal ? 'Edit Fitness Goal' : 'Establish New Goal'}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Target Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            name="targetWeight"
            value={formData.targetWeight}
            onChange={handleChange}
            required
            placeholder="e.g. 70.5"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Target Calories (kcal/day)</label>
          <input
            type="number"
            name="targetCalories"
            value={formData.targetCalories}
            onChange={handleChange}
            required
            placeholder="e.g. 2000"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Deadline Date</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300"
      >
        {goal ? 'Update Goal' : 'Assign Goal'}
      </button>
    </form>
  )
}
