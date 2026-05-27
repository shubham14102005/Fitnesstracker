import { useEffect, useState } from 'react'
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../api'
import Modal from '../components/Modal'
import WorkoutForm from '../components/WorkoutForm'

export default function Workouts({ activeUser, users }) {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      const res = await getWorkouts()
      setWorkouts(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const handleCreate = async (workoutData) => {
    try {
      await createWorkout(workoutData)
      setShowModal(false)
      fetchWorkouts()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (workoutData) => {
    try {
      await updateWorkout(selectedWorkout.id, workoutData)
      setShowModal(false)
      setSelectedWorkout(null)
      fetchWorkouts()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout log?')) {
      try {
        await deleteWorkout(id)
        fetchWorkouts()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  // Role Parsing
  const userRoles = activeUser?.r?.map(role => role.roleName.toUpperCase()) || []
  const isUser = userRoles.includes('ROLE_USER')

  // Filter workouts based on the selected active user session (only filter for regular users)
  const displayedWorkouts = isUser && activeUser
    ? workouts.filter(w => w.user?.id === activeUser.id)
    : workouts

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
            {isUser && activeUser ? `${activeUser.name}'s Workouts` : 'Workout Logs'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isUser 
              ? 'View workouts and exercises assigned by your trainer.' 
              : 'View and audit workout activities across all members.'}
          </p>
        </div>
        {!isUser && (
          <button
            onClick={() => { setSelectedWorkout(null); setShowModal(true) }}
            className="px-5 py-3 rounded-xl font-bold bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            + New Workout
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {displayedWorkouts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 bg-[#2a2a2a]">
          <span className="text-5xl block mb-4">🏋️</span>
          <h3 className="text-xl font-bold text-white mb-1">No workouts logged yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            {isUser 
              ? 'There are no workouts assigned to you yet. Please contact your trainer.'
              : 'Get active and log your first physical activity details.'}
          </p>
          {!isUser && (
            <button
              onClick={() => { setSelectedWorkout(null); setShowModal(true) }}
              className="px-4 py-2.5 text-sm rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
            >
              Log First Workout
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedWorkouts.map(workout => (
            <div key={workout.id} className="glass-card rounded-2xl p-6 bg-[#2a2a2a] flex flex-col justify-between relative overflow-hidden group border border-white/5">
              {/* Decorative accent glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ed563b]/5 rounded-full blur-xl group-hover:bg-[#ed563b]/10 transition duration-500"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ed563b]/10 text-[#ed563b] border border-[#ed563b]/20">
                    ⚡ {workout.type}
                  </span>
                  {!isUser && workout.user && (
                    <span className="text-xs text-slate-300 font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                      👤 {workout.user.name}
                    </span>
                  )}
                </div>

                <div className="space-y-3.5 mb-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400 font-semibold">Date Assigned</span>
                    <span className="text-sm font-semibold text-slate-200">{workout.date || 'Today'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400 font-semibold">Duration</span>
                    <span className="font-bold text-slate-200">{workout.duration} mins</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400 font-semibold">Calories Burned</span>
                    <span className="font-bold text-[#ed563b]">{workout.caloriesBurned} kcal</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-sm text-slate-400 font-semibold">Assigned By</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {workout.assignedBy ? workout.assignedBy.name.split(' ')[0] : 'System'}
                    </span>
                  </div>
                </div>
              </div>

              {!isUser && (
                <div className="flex gap-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => { setSelectedWorkout(workout); setShowModal(true) }}
                    className="px-3 py-2 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 text-white transition duration-200 flex-1 border border-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="px-3 py-2 rounded-xl text-sm font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition duration-200 flex-1 border border-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <WorkoutForm
            workout={selectedWorkout}
            users={users}
            activeUser={activeUser}
            onSubmit={selectedWorkout ? handleUpdate : handleCreate}
          />
        </Modal>
      )}
    </div>
  )
}
