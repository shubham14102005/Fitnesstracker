import { useEffect, useState } from 'react'
import { getUsers, getWorkouts, getMeals, getGoals } from '../api'

export default function Dashboard({ activeUser, users }) {
  const [stats, setStats] = useState({ users: [], workouts: [], meals: [], goals: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [usersRes, workoutsRes, mealsRes, goalsRes] = await Promise.all([
          getUsers(),
          getWorkouts(),
          getMeals(),
          getGoals()
        ])
        
        setStats({
          users: usersRes.data,
          workouts: workoutsRes.data,
          meals: mealsRes.data,
          goals: goalsRes.data
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ed563b]"></div>
    </div>
  )
  if (error) return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm flex items-center gap-2 max-w-lg mx-auto mt-10">
      <span>⚠️</span> Error loading stats: {error}
    </div>
  )

  const todayStr = new Date().toISOString().split('T')[0]

  // Role Parsing
  const userRoles = activeUser?.r?.map(role => role.roleName.toUpperCase()) || []
  const isAdmin = userRoles.includes('ROLE_ADMIN') || !activeUser
  const isTrainer = userRoles.includes('ROLE_TRAINER')
  const isUser = userRoles.includes('ROLE_USER')

  if (isUser && activeUser) {
    // User View metrics
    const userWorkouts = stats.workouts.filter(w => w.user?.id === activeUser.id)
    const userMeals = stats.meals.filter(m => m.user?.id === activeUser.id)
    const userGoal = stats.goals.find(g => g.user?.id === activeUser.id)

    const todayMeals = userMeals.filter(m => m.date === todayStr)
    const todayCaloriesIntake = todayMeals.reduce((sum, m) => sum + m.calories, 0)
    const totalCaloriesBurned = userWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)

    // Calculate BMI
    const bmi = activeUser.height > 0 
      ? (activeUser.weight / (activeUser.height * activeUser.height)).toFixed(1) 
      : 0
    
    let bmiCategory = 'Unknown'
    let bmiColor = 'text-slate-400 bg-white/5 border-white/10'
    if (bmi > 0) {
      if (bmi < 18.5) {
        bmiCategory = 'Underweight'
        bmiColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      } else if (bmi < 25) {
        bmiCategory = 'Normal'
        bmiColor = 'text-green-400 bg-green-500/10 border-green-500/20'
      } else if (bmi < 30) {
        bmiCategory = 'Overweight'
        bmiColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      } else {
        bmiCategory = 'Obese'
        bmiColor = 'text-red-400 bg-red-500/10 border-red-500/20'
      }
    }

    // Goal weights
    const hasGoal = !!userGoal

    // Calorie Goal progress
    const calorieGoal = hasGoal ? userGoal.targetCalories : 2000

    const chartData = [
      { 
        label: 'Calories Intake', 
        actual: todayCaloriesIntake, 
        goal: calorieGoal, 
        actualColor: 'bg-[#ed563b] hover:bg-[#ff684d] shadow-[0_4px_12px_rgba(237,86,59,0.25)]',
        goalColor: 'bg-white/10 hover:bg-white/15'
      },
      { 
        label: 'Calories Burned', 
        actual: totalCaloriesBurned, 
        goal: 500, // Daily default target
        actualColor: 'bg-orange-500 hover:bg-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.25)]',
        goalColor: 'bg-white/10 hover:bg-white/15'
      }
    ]

    const maxVal = Math.max(...chartData.flatMap(d => [d.actual, d.goal])) || 1

    return (
      <div className="space-y-8 animate-fadeIn text-white">
        {/* Welcome Section */}
        <div className="border-b border-white/5 pb-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Welcome Back, <span className="text-[#ed563b]">{activeUser.name ? activeUser.name.split(' ')[0] : 'User'}</span>!
          </h1>
          <p className="text-slate-450 text-sm mt-1">Here is your personal fitness and metrics summary for today.</p>
        </div>

        {/* Achievements Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950/40 via-[#232323] to-[#2a2a2a] p-6 text-white shadow-xl border border-white/5">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-[#ed563b]/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-10 -mb-6 w-32 h-32 bg-[#ed563b]/5 rounded-full blur-2xl"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-3xl animate-bounce shadow-inner">
              🏆
            </div>
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#ed563b]/20 border border-[#ed563b]/30 text-[#ed563b]">
                Achievement Unlocked
              </span>
              <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
                CONGRATULATIONS! You have unlocked the 'Expert' level
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Your consistent physical activity and meal tracking have placed you in the top 5% of active members this month.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Premium Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Exercise */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
            <CircularProgress 
              value={totalCaloriesBurned} 
              max={1000} 
              text="Total calories burned today" 
              icon="🏃‍♂️" 
              title="Exercise" 
              label="kcal" 
            />
          </div>

          {/* Card 2: Nutrition */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#ed563b] to-orange-600 text-white shadow-lg shadow-orange-500/10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
            <CircularProgress 
              value={todayCaloriesIntake} 
              max={calorieGoal} 
              text="Kcal consumed today" 
              icon="🥗" 
              title="Nutrition" 
              label="kcal" 
            />
          </div>

          {/* Card 3: Goal Weight */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-600 to-[#ed563b] text-white shadow-lg shadow-orange-500/10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
            <CircularProgress 
              value={activeUser.weight} 
              max={hasGoal ? userGoal.targetWeight : 75} 
              text={hasGoal ? `Target: ${userGoal.targetWeight} kg` : "No target weight set"} 
              icon="⚖️" 
              title="Goal Weight" 
              label="kg" 
            />
          </div>

          {/* Card 4: BMI */}
          <div className="rounded-3xl p-6 bg-[#2a2a2a] border border-white/5 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
            <CircularProgress 
              value={parseFloat(bmi)} 
              max={30} 
              text={bmiCategory} 
              icon="🫀" 
              title="BMI Index" 
              label="" 
              strokeColor="stroke-[#ed563b]"
            />
          </div>
        </div>

        {/* Chart & Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calories Statistics (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="glass-card bg-[#2a2a2a] rounded-3xl p-6 border border-white/5 shadow-lg flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📊</span> Daily Calories Overview
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Logged calories vs daily targets</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ed563b]"></span>
                    <span className="text-slate-300">Actual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white/10 border border-white/20"></span>
                    <span className="text-slate-400">Goal</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-around px-2 pt-6 pb-2 min-h-[220px]">
                {chartData.map((d, index) => {
                  const actualHeightPct = (d.actual / maxVal) * 100
                  const goalHeightPct = (d.goal / maxVal) * 100
                  return (
                    <div key={index} className="flex flex-col items-center gap-3 w-5/12 group">
                      {/* Bars wrapper */}
                      <div className="w-full flex items-end justify-center gap-3 h-[180px] relative">
                        
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 whitespace-nowrap shadow-lg border border-slate-800">
                          <p className="text-white">Actual: <span className="font-extrabold text-[#ed563b]">{d.actual.toLocaleString()} kcal</span></p>
                          <p className="text-slate-400">Goal: <span className="font-extrabold text-slate-200">{d.goal.toLocaleString()} kcal</span></p>
                        </div>

                        {/* Actual Bar */}
                        <div 
                          className={`w-6 sm:w-8 rounded-t-lg transition-all duration-300 relative cursor-pointer ${d.actualColor}`}
                          style={{ height: `${actualHeightPct}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-lg"></div>
                        </div>

                        {/* Goal Bar */}
                        <div 
                          className={`w-6 sm:w-8 rounded-t-lg transition-all duration-300 relative cursor-pointer ${d.goalColor}`}
                          style={{ height: `${goalHeightPct}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-t-lg"></div>
                        </div>
                      </div>

                      {/* Label */}
                      <span className="text-xs font-bold text-slate-400 group-hover:text-white transition duration-200">
                        {d.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity Feed (1/3 width) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Recent Workouts */}
            <div className="glass-card bg-[#2a2a2a] rounded-3xl p-6 border border-white/5 shadow-lg flex-1">
              <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><span>🏋️</span> Recent Exercises</span>
                <span className="text-[10px] font-bold text-[#ed563b] px-2 py-0.5 rounded bg-[#ed563b]/10 border border-[#ed563b]/20">Today</span>
              </h3>
              {userWorkouts.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs italic">No exercises logged yet.</div>
              ) : (
                <div className="space-y-3">
                  {userWorkouts.slice(-3).reverse().map(w => (
                    <div key={w.id} className="flex justify-between items-center p-3 rounded-2xl bg-[#1e1e1e] hover:bg-[#232323] border border-white/5 transition">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{w.type}</p>
                        <p className="text-[10px] text-slate-450 font-semibold mt-0.5">{w.duration} mins duration</p>
                      </div>
                      <span className="text-xs font-extrabold text-[#ed563b] shrink-0">-{w.caloriesBurned} kcal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Meals */}
            <div className="glass-card bg-[#2a2a2a] rounded-3xl p-6 border border-white/5 shadow-lg flex-1">
              <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><span>🍽️</span> Recent Meals</span>
                <span className="text-[10px] font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">Today</span>
              </h3>
              {userMeals.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs italic">No meals logged yet.</div>
              ) : (
                <div className="space-y-3">
                  {userMeals.slice(-3).reverse().map(m => (
                    <div key={m.id} className="flex justify-between items-center p-3 rounded-2xl bg-[#1e1e1e] hover:bg-[#232323] border border-white/5 transition">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{m.name}</p>
                        <p className="text-[10px] text-slate-450 font-semibold mt-0.5">{m.date}</p>
                      </div>
                      <span className="text-xs font-extrabold text-orange-400 shrink-0">+{m.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gym Facilities & Trainer Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gym Details (2/3 width) */}
          <div className="lg:col-span-2 glass-card bg-[#2a2a2a] rounded-3xl p-6 border border-white/5 shadow-lg flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 rounded-2xl overflow-hidden relative group h-48 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800" 
                alt="FitNexus Facility" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-xs font-black uppercase bg-[#ed563b] text-white px-3 py-1.5 rounded-lg shadow-md shadow-orange-950/30">
                FitNexus HQ
              </span>
            </div>
            
            <div className="md:w-1/2 flex flex-col justify-between space-y-4 py-1">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ed563b]">Facility Location</span>
                <h3 className="text-xl font-black uppercase text-white">Your Gym Branch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Welcome to the SG Highway location of FitNexus. Enjoy state-of-the-art weights, cardio tracks, steam rooms, and expert trainer guidance.
                </p>
              </div>
              
              <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">📍 Address</span>
                  <span className="font-bold text-slate-200 text-right">SG Highway, Ahmedabad, India</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">⏰ Hours</span>
                  <span className="font-bold text-slate-200">06:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">📞 Front Desk</span>
                  <span className="font-bold text-slate-200">+91 9898849209</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assigned Trainer Profile (1/3 width) */}
          <div className="lg:col-span-1 glass-card bg-[#2a2a2a] rounded-3xl p-6 border border-white/5 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ed563b] block mb-2">Expert Coach</span>
              <h3 className="text-lg font-black uppercase text-white mb-4">Your Gym Coach</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=200" 
                  alt="Trainer Alice" 
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-white">Trainer Alice</h4>
                  <p className="text-[10px] text-[#ed563b] font-bold uppercase tracking-wider">Cardio & HIIT Coach</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Alice is assigned to monitor your metrics, log workouts, and design custom calorie charts for your profile.
              </p>
            </div>
            
            <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-semibold">📧 Contact</span>
              <span className="font-bold text-slate-200">alice@fitnexus.com</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Trainer Coach view or Admin view
  const title = isTrainer ? "Trainer Coach Dashboard" : "Fitnesstracker Admin Dashboard"
  const subtitle = isTrainer 
    ? `Welcome ${activeUser?.name ? activeUser.name.split(' ')[0] : 'Trainer'}! Log exercises, map nutrition plans, and track members health metrics.`
    : "Overview of registered members, logged metrics, goals, and role assignments."

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-slate-400 text-sm mt-1.5">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Members" value={stats.users.length} icon="👥" gradient="from-orange-500/10 to-amber-500/10 text-[#ed563b] border-white/5" />
        <StatCard title="Exercises Logged" value={stats.workouts.length} icon="🏋️" gradient="from-orange-500/10 to-amber-500/10 text-[#ed563b] border-white/5" />
        <StatCard title="Nutrition logs" value={stats.meals.length} icon="🍽️" gradient="from-orange-500/10 to-amber-500/10 text-[#ed563b] border-white/5" />
        <StatCard title="Goals Configured" value={stats.goals.length} icon="🎯" gradient="from-orange-500/10 to-amber-500/10 text-[#ed563b] border-white/5" />
      </div>

      <div className="glass-card bg-[#2a2a2a] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/5 bg-[#232323]">
          <h3 className="text-lg font-bold text-white">Members Directories & Baseline Health Metrics</h3>
          <p className="text-xs text-slate-400 mt-1">Review weight, height, BMI Index, and active credentials for members.</p>
        </div>
        <div className="overflow-x-auto">
          {stats.users.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">No members registered yet.</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#232323] border-b border-white/5">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Age</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Weight</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Height</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">BMI</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.users.map(user => {
                  const bmi = user.height > 0 ? (user.weight / (user.height * user.height)).toFixed(1) : 0
                  return (
                    <tr key={user.id} className="hover:bg-[#333333] transition duration-150">
                      <td className="p-4 text-sm font-bold text-white">{user.name}</td>
                      <td className="p-4 text-sm text-slate-400">{user.email}</td>
                      <td className="p-4 text-sm text-slate-300">{user.age} yrs</td>
                      <td className="p-4 text-sm text-slate-300">{user.weight} kg</td>
                      <td className="p-4 text-sm text-slate-300">{user.height} m</td>
                      <td className="p-4 text-sm font-bold text-[#ed563b]">{bmi > 0 ? bmi : '--'}</td>
                      <td className="p-4 text-sm">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          user.enabled 
                            ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                            : 'text-slate-400 bg-white/5 border-white/10'
                        }`}>
                          {user.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className={`glass-card bg-[#2a2a2a] rounded-2xl p-6 relative overflow-hidden group border ${gradient}`}>
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ed563b]/5 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider">Metrics</span>
      </div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-extrabold mt-1 text-white">{value}</p>
    </div>
  )
}

function CircularProgress({ value, max, text, icon, title, label, strokeColor = 'stroke-white' }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1 text-white">
        <div className="flex items-center gap-1.5 opacity-90 text-[10px] font-bold uppercase tracking-widest">
          <span>{icon}</span> {title}
        </div>
        <p className="text-2xl font-extrabold mt-1 leading-none">
          {value} <span className="text-xs font-normal opacity-80">/ {max} {label}</span>
        </p>
        <p className="text-[10px] opacity-75 font-semibold pt-1 leading-none">{text}</p>
      </div>
      
      <div className="relative flex items-center justify-center w-14 h-14 shrink-0 select-none">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-white/20"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            className={`${strokeColor} transition-all duration-500 ease-out`}
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-extrabold text-white">{percent}%</span>
      </div>
    </div>
  )
}
