import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Workouts from './pages/Workouts'
import Meals from './pages/Meals'
import Goals from './pages/Goals'
import Roles from './pages/Roles'
import Login from './pages/Login'
import Landing from './pages/Landing'
import { getUsers } from './api'

function Unauthorized() {
  return (
    <div className="glass-card rounded-2xl p-12 text-center border border-white/5 max-w-md mx-auto my-12 animate-fadeIn bg-[#2a2a2a] text-white">
      <span className="text-5xl block mb-4">🚫</span>
      <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
      <p className="text-slate-400 text-sm mb-6">
        You do not have the required administrative permissions to access this page.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 text-sm rounded-xl font-bold bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}

export default function App() {
  const [users, setUsers] = useState([])
  const [activeUser, setActiveUser] = useState(() => {
    const cached = localStorage.getItem('activeUser')
    return cached ? JSON.parse(cached) : null
  })

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch (err) {
      console.error("Failed to fetch users", err)
    }
  }

  useEffect(() => {
    if (activeUser) {
      fetchUsers()
    }
  }, [activeUser])

  const handleLoginSuccess = (user) => {
    setActiveUser(user)
    localStorage.setItem('activeUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setActiveUser(null)
    localStorage.removeItem('activeUser')
  }

  // If user is not logged in, render the Landing page directly (avoid double headers/margins)
  if (!activeUser) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Landing onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </BrowserRouter>
    )
  }

  // Role Parsing
  const userRoles = activeUser?.r?.map(role => role.roleName.toUpperCase()) || []
  const isAdmin = userRoles.includes('ROLE_ADMIN')
  const isTrainer = userRoles.includes('ROLE_TRAINER')
  const isUser = userRoles.includes('ROLE_USER')

  const linkClass = ({ isActive }) =>
    `px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
      isActive
        ? 'bg-[#ed563b] text-white shadow-[0_4px_12px_rgba(237,86,59,0.15)] border border-transparent'
        : 'text-slate-350 hover:text-[#ed563b] hover:bg-white/5'
    }`

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col font-sans antialiased">
        {/* Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1e1e1e]/95 border-b border-white/5 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group font-black text-2xl uppercase tracking-wider text-white">
              FIT<span className="text-[#ed563b]">NEXUS</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1.5">
              <NavLink to="/" className={linkClass}>Dashboard</NavLink>
              {isAdmin && <NavLink to="/users" className={linkClass}>Users</NavLink>}
              <NavLink to="/workouts" className={linkClass}>Workouts</NavLink>
              <NavLink to="/meals" className={linkClass}>Meals</NavLink>
              <NavLink to="/goals" className={linkClass}>Goals</NavLink>
              {isAdmin && <NavLink to="/roles" className={linkClass}>Roles</NavLink>}
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#2a2a2a] border border-white/5 rounded-xl p-1.5 pl-3.5 shadow-lg">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-white leading-tight">{activeUser.name}</span>
                  <span className="text-[10px] text-[#ed563b] font-extrabold uppercase tracking-wider leading-none mt-0.5">
                    {activeUser.r && activeUser.r[0] ? activeUser.r[0].roleName.replace('ROLE_', '') : 'USER'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs rounded-lg font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation bar */}
          <div className="lg:hidden border-t border-white/5 bg-[#1e1e1e]/95 py-2 px-4 overflow-x-auto flex gap-1.5 scrollbar-none justify-center">
            <NavLink to="/" className={linkClass}>Dashboard</NavLink>
            {isAdmin && <NavLink to="/users" className={linkClass}>Users</NavLink>}
            <NavLink to="/workouts" className={linkClass}>Workouts</NavLink>
            <NavLink to="/meals" className={linkClass}>Meals</NavLink>
            <NavLink to="/goals" className={linkClass}>Goals</NavLink>
            {isAdmin && <NavLink to="/roles" className={linkClass}>Roles</NavLink>}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-36 pb-10 lg:pt-28">
          <Routes>
            {/* Landing / Dashboard Route */}
            <Route 
              path="/" 
              element={<Dashboard activeUser={activeUser} users={users} />} 
            />

            {/* Guarded App Routes */}
            <Route 
              path="/users" 
              element={isAdmin ? <Users activeUser={activeUser} onUsersChange={fetchUsers} users={users} /> : <Unauthorized />} 
            />
            <Route 
              path="/roles" 
              element={isAdmin ? <Roles activeUser={activeUser} users={users} /> : <Unauthorized />} 
            />
            <Route 
              path="/workouts" 
              element={<Workouts activeUser={activeUser} users={users} />} 
            />
            <Route 
              path="/meals" 
              element={<Meals activeUser={activeUser} users={users} />} 
            />
            <Route 
              path="/goals" 
              element={<Goals activeUser={activeUser} users={users} />} 
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#191919] py-10 text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-xl uppercase tracking-wider text-white">
                FIT<span className="text-[#ed563b]">NEXUS</span>
              </div>
              <p className="text-xs text-slate-450 max-w-xs leading-relaxed">
                Empowering individuals to achieve their physical potential and bridging coaches with fitness members in one unified space.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Contact Information</h4>
              <p className="text-xs text-slate-350 flex items-center gap-2">
                📧 <span className="font-semibold">Email:</span> support@fitnesstracker.com
              </p>
              <p className="text-xs text-slate-350 flex items-center gap-2">
                📞 <span className="font-semibold">Phone:</span> +91 9898849209
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Corporate Address</h4>
              <p className="text-xs text-slate-350 leading-relaxed">
                🏢 <span className="font-semibold">Office:</span> SG Highway, Ahmedabad, Gujarat, India
              </p>
              <p className="text-xs text-slate-450 mt-2">
                © {new Date().getFullYear()} Fitnesstracker Premium. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
