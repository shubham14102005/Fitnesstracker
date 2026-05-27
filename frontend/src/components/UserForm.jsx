import { useState, useEffect } from 'react'

export default function UserForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    enabled: true
  })
  const [role, setRole] = useState('ROLE_USER')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        enabled: user.enabled !== undefined ? user.enabled : true
      })
      // Pre-select existing role if available
      const existingRole = user.r && user.r[0] ? user.r[0].roleName : 'ROLE_USER'
      setRole(existingRole)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = { ...formData }

    // Type casting validation
    submitData.age = parseInt(submitData.age, 10)
    submitData.weight = parseFloat(submitData.weight)
    submitData.height = parseFloat(submitData.height)

    if (!user && !submitData.password) {
      alert('Password is required for new users')
      return
    }
    if (user && !submitData.password) {
      delete submitData.password
    }
    onSubmit(submitData, role)
  }

  const roleOptions = [
    { value: 'ROLE_USER',    label: '👤 Member (User)',   desc: 'Can track workouts, meals & goals' },
    { value: 'ROLE_TRAINER', label: '🏋️ Trainer',         desc: 'Can manage member data & plans' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-transparent text-white p-1">
      <h2 className="text-2xl font-black uppercase text-white border-b border-white/5 pb-3">
        {user ? 'Edit Member Profile' : 'Register New Member'}
      </h2>

      {/* Role Selector */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
          Assign Role
        </label>
        <div className="grid grid-cols-2 gap-3">
          {roleOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                role === opt.value
                  ? 'border-[#ed563b] bg-[#ed563b]/10 shadow-sm shadow-orange-950/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-bold text-white">{opt.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
              {role === opt.value && (
                <div className="mt-1.5 text-[9px] font-extrabold text-[#ed563b] uppercase tracking-wider">✓ Selected</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. John Doe"
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="e.g. john.doe@example.com"
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
          Password {user && <span className="text-slate-500 font-normal">(leave blank to keep current)</span>}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!user}
            placeholder="••••••••"
            className="w-full glass-input rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-[#ed563b] transition focus:outline-none cursor-pointer"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="e.g. 25"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            placeholder="e.g. 72.5"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Height (meters)</label>
        <input
          type="number"
          step="0.01"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
          placeholder="e.g. 1.75"
          className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          name="enabled"
          id="enabled"
          checked={formData.enabled}
          onChange={handleChange}
          className="w-4 h-4 rounded text-[#ed563b] focus:ring-[#ed563b] bg-[#1e1e1e] border-white/10 cursor-pointer"
        />
        <label htmlFor="enabled" className="text-sm font-medium text-slate-350 cursor-pointer select-none">
          Active Account Status
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300"
      >
        {user ? 'Update Member Profile' : 'Register Member'}
      </button>
    </form>
  )
}
