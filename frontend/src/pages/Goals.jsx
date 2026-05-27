import { useEffect, useState } from 'react'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../api'
import Modal from '../components/Modal'
import GoalForm from '../components/GoalForm'

export default function Goals({ activeUser, users }) {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const res = await getGoals()
      setGoals(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleCreate = async (goalData) => {
    try {
      await createGoal(goalData)
      setShowModal(false)
      fetchGoals()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (goalData) => {
    try {
      await updateGoal(selectedGoal.id, goalData)
      setShowModal(false)
      setSelectedGoal(null)
      fetchGoals()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fitness goal?')) {
      try {
        await deleteGoal(id)
        fetchGoals()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  // Role Parsing
  const userRoles = activeUser?.r?.map(role => role.roleName.toUpperCase()) || []
  const isUser = userRoles.includes('ROLE_USER')

  // Filter goals depending on selected activeUser session (only filter for regular users)
  const displayedGoals = isUser && activeUser
    ? goals.filter(g => g.user?.id === activeUser.id)
    : goals

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ed563b]"></div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            {isUser && activeUser ? `${activeUser.name}'s Goals` : 'Fitness Goals'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isUser 
              ? 'Track weights and daily calorie targets.' 
              : 'Manage target metrics across all fitness members.'}
          </p>
        </div>
        {(!isUser || displayedGoals.length === 0) && (
          <button
            onClick={() => { setSelectedGoal(null); setShowModal(true) }}
            className="px-5 py-3 rounded-xl font-bold bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            + Establish Goal
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {displayedGoals.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 bg-[#2a2a2a]">
          <span className="text-5xl block mb-4">🎯</span>
          <h3 className="text-xl font-bold text-white mb-1">No goals set yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Get started by establishing targets for weight and daily calorie intake.
          </p>
          <button
            onClick={() => { setSelectedGoal(null); setShowModal(true) }}
            className="px-4 py-2.5 text-sm rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
          >
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGoals.map(goal => (
            <div key={goal.id} className="glass-card rounded-2xl p-6 bg-[#2a2a2a] flex flex-col justify-between relative overflow-hidden group border border-white/5">
              {/* Decorative accent glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ed563b]/5 rounded-full blur-xl group-hover:bg-[#ed563b]/10 transition duration-500"></div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ed563b]/10 text-[#ed563b] border border-[#ed563b]/20">
                    🎯 Fitness Target
                  </span>
                  {!isUser && goal.user && (
                    <span className="text-xs text-slate-300 font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                      👤 {goal.user.name}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3.5 mb-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400 font-semibold">Target Weight</span>
                    <span className="font-bold text-white">{goal.targetWeight} kg</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400 font-semibold">Target Calories</span>
                    <span className="font-bold text-white">{goal.targetCalories} kcal</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-sm text-slate-400 font-semibold">Deadline</span>
                    <span className="text-sm font-bold text-slate-200">{goal.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-white/5">
                <button
                  onClick={() => { setSelectedGoal(goal); setShowModal(true) }}
                  className="px-3 py-2 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 text-white transition duration-200 flex-1 border border-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="px-3 py-2 rounded-xl text-sm font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition duration-200 flex-1 border border-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <GoalForm
            goal={selectedGoal}
            users={users}
            goals={goals}
            activeUser={activeUser}
            onSubmit={selectedGoal ? handleUpdate : handleCreate}
          />
        </Modal>
      )}
    </div>
  )
}
