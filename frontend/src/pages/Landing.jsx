import { useState, useEffect } from 'react'
import { createUser, getUsers } from '../api'
import Login from './Login'
import Modal from '../components/Modal'

// Preset trainer card visuals — cycles through if more trainers exist
const TRAINER_PRESETS = [
  {
    specialty: 'Strength & Resistance',
    desc: 'Specialized in lifting targets, body metrics management, and workout logging audits.',
    img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600'
  },
  {
    specialty: 'Cardio & HIIT Coach',
    desc: 'Focused on endurance optimization, fat burning schedules, and dietary audit compliance.',
    img: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600'
  },
  {
    specialty: 'Bodybuilding Specialist',
    desc: 'Provides guidance on mass building, macro diets, and long-term athletic targets.',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600'
  },
  {
    specialty: 'Yoga & Flexibility',
    desc: 'Guides members through flexibility, mobility, and mindful movement programs.',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600'
  },
]

export default function Landing({ onLoginSuccess }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [activeTab, setActiveTab] = useState('Monday')
  const [trainers, setTrainers] = useState([])
  
  // Registration state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    password: ''
  })
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(null)
  const [regError, setRegError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  // Fetch trainers from DB on mount
  useEffect(() => {
    getUsers()
      .then(res => {
        const trainerUsers = res.data
          .filter(u =>
            u.r &&
            u.r.some(role => role.roleName === 'ROLE_TRAINER') &&
            !u.r.some(role => role.roleName === 'ROLE_ADMIN')
          )
          .slice(0, 3)
        setTrainers(trainerUsers)
      })
      .catch(() => setTrainers([]))
  }, [])

  const handleRegChange = (e) => {
    const { name, value } = e.target
    setRegData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegLoading(true)
    setRegError(null)
    setRegSuccess(null)
    try {
      await createUser({
        name: regData.name,
        email: regData.email,
        age: parseInt(regData.age, 10),
        weight: parseFloat(regData.weight),
        height: parseFloat(regData.height),
        password: regData.password,
        enabled: true
      })
      setRegSuccess('Registration successful! You can now sign in using the Login button.')
      setRegData({ name: '', email: '', age: '', weight: '', height: '', password: '' })
      // Auto open login modal after 2 seconds
      setTimeout(() => {
        setShowLoginModal(true)
      }, 1500)
    } catch (err) {
      console.error(err)
      setRegError(err.response?.data?.message || 'Failed to join. Please check your inputs.')
    } finally {
      setRegLoading(false)
    }
  }

  const scheduleData = {
    Monday: [
      { name: 'Fitness Class', time: '10:00AM - 11:30AM', trainer: 'Trainer Bob' },
      { name: 'Cardio Training', time: '02:00PM - 03:30PM', trainer: 'Trainer Alice' },
    ],
    Tuesday: [
      { name: 'Muscle Building', time: '09:00AM - 10:30AM', trainer: 'Trainer David' },
      { name: 'Yoga & Pilates', time: '04:00PM - 05:30PM', trainer: 'Trainer Sarah' },
    ],
    Wednesday: [
      { name: 'Body Shaping', time: '11:00AM - 12:30PM', trainer: 'Trainer Bob' },
      { name: 'Cardio HIIT', time: '03:00PM - 04:30PM', trainer: 'Trainer Alice' },
    ],
    Thursday: [
      { name: 'Advanced Lift', time: '03:00PM - 04:30PM', trainer: 'Trainer David' },
      { name: 'Fitness Class', time: '06:00PM - 07:30PM', trainer: 'Trainer Bob' },
    ],
    Friday: [
      { name: 'Yoga & Pilates', time: '10:00AM - 11:30AM', trainer: 'Trainer Sarah' },
      { name: 'Cardio HIIT', time: '01:00PM - 02:30PM', trainer: 'Trainer Alice' },
    ]
  }

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen font-sans antialiased overflow-x-hidden">
      
      {/* Navigation Header */}
      <nav className="w-full bg-[#1e1e1e]/95 border-b border-white/5 py-5 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="font-black text-2xl tracking-wider uppercase text-white">
            FIT<span className="text-[#ed563b]">NEXUS</span>
          </a>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-xs uppercase font-extrabold tracking-wider">
              <a href="#hero" className="text-white hover:text-[#ed563b] transition duration-300">Home</a>
              <a href="#programs" className="text-white hover:text-[#ed563b] transition duration-300">Programs</a>
              <a href="#schedule" className="text-white hover:text-[#ed563b] transition duration-300">Schedules</a>
              <a href="#trainers" className="text-white hover:text-[#ed563b] transition duration-300">Trainers</a>
              <a href="#join-us" className="text-white hover:text-[#ed563b] transition duration-300">Join Us</a>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white rounded-lg transition duration-300 shadow-lg shadow-orange-950/20"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section 
        id="hero" 
        className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 30, 30, 0.75), rgba(30, 30, 30, 0.85)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center max-w-4xl space-y-6 relative z-10 animate-fadeIn">
          <h6 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#ed563b]">
            work harder, get stronger
          </h6>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-wider text-white leading-none">
            easy with our <span className="text-[#ed563b]">gym</span>
          </h1>
          <p className="text-slate-350 text-sm max-w-2xl mx-auto leading-relaxed font-medium">
            Join the ultimate wellness ecosystem. Get customized workouts, dynamic diet logs, and direct coaching targets managed by certified physical trainers.
          </p>
          <div className="pt-4">
            <a 
              href="#join-us" 
              className="px-8 py-4 text-xs font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white rounded-lg transition duration-300 inline-block shadow-lg shadow-orange-950/20"
            >
              Become a Member
            </a>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black uppercase tracking-wider">
            Choose <span className="text-[#ed563b]">Program</span>
          </h2>
          <div className="w-16 h-1 bg-[#ed563b] mx-auto rounded-full"></div>
          <p className="text-slate-400 text-xs leading-relaxed font-medium pt-2">
            Top-tier physical courses tailored to achieve your metrics, from baseline strength training to premium diet controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-white/5 flex gap-6 hover:-translate-y-1 transition duration-300">
            <div className="text-3xl text-[#ed563b]">🏋️</div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">Basic Fitness</h4>
              <p className="text-slate-450 text-xs leading-relaxed">
                Establish targets, build physical endurance, and begin tracking your weight and daily metrics.
              </p>
              <a href="#join-us" className="text-xs font-bold text-[#ed563b] uppercase tracking-wider hover:underline block pt-1">Learn More</a>
            </div>
          </div>

          <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-white/5 flex gap-6 hover:-translate-y-1 transition duration-300">
            <div className="text-3xl text-[#ed563b]">💪</div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">Advanced Muscle Course</h4>
              <p className="text-slate-450 text-xs leading-relaxed">
                Engage in specialized heavy resistance courses managed directly by our trainers for optimum size gains.
              </p>
              <a href="#join-us" className="text-xs font-bold text-[#ed563b] uppercase tracking-wider hover:underline block pt-1">Learn More</a>
            </div>
          </div>

          <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-white/5 flex gap-6 hover:-translate-y-1 transition duration-300">
            <div className="text-3xl text-[#ed563b]">🧘</div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">Yoga & Pilates</h4>
              <p className="text-slate-450 text-xs leading-relaxed">
                Unlock flexibility, balance, core stability, and mental mindfulness under certified trainers.
              </p>
              <a href="#join-us" className="text-xs font-bold text-[#ed563b] uppercase tracking-wider hover:underline block pt-1">Learn More</a>
            </div>
          </div>

          <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-white/5 flex gap-6 hover:-translate-y-1 transition duration-300">
            <div className="text-3xl text-[#ed563b]">🏃</div>
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase">Cardio Training</h4>
              <p className="text-slate-450 text-xs leading-relaxed">
                High-intensity interval training (HIIT) to optimize fat burning and cardiovascular capability.
              </p>
              <a href="#join-us" className="text-xs font-bold text-[#ed563b] uppercase tracking-wider hover:underline block pt-1">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Schedules Section */}
      <section id="schedule" className="py-24 bg-[#232323]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-wider">
              Classes <span className="text-[#ed563b]">Schedule</span>
            </h2>
            <div className="w-16 h-1 bg-[#ed563b] mx-auto rounded-full"></div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium pt-2">
              Review weekly class calendars. Register to join programs and let our coaches organize your routine.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {Object.keys(scheduleData).map(day => (
              <button
                key={day}
                onClick={() => setActiveTab(day)}
                className={`px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition duration-200 ${
                  activeTab === day 
                    ? 'bg-[#ed563b] text-white shadow-md shadow-orange-950/20' 
                    : 'bg-[#2a2a2a] text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule list */}
          <div className="max-w-3xl mx-auto bg-[#2a2a2a] rounded-2xl border border-white/5 overflow-hidden shadow-xl animate-fadeIn">
            <div className="divide-y divide-white/5">
              {scheduleData[activeTab].map((cls, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-lg text-white">{cls.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Managed by: <span className="text-[#ed563b] font-bold">{cls.trainer}</span></p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1e1e1e] text-slate-300 border border-white/5">
                      ⏰ {cls.time}
                    </span>
                    <a href="#join-us" className="text-xs font-black uppercase text-[#ed563b] hover:text-[#ff684d] tracking-wider transition">Book Class</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black uppercase tracking-wider">
            Expert <span className="text-[#ed563b]">Trainers</span>
          </h2>
          <div className="w-16 h-1 bg-[#ed563b] mx-auto rounded-full"></div>
          <p className="text-slate-400 text-xs leading-relaxed font-medium pt-2">
            {trainers.length > 0
              ? `Meet our ${trainers.length} certified trainer${trainers.length > 1 ? 's' : ''} ready to assign you customized fitness plans.`
              : 'Meet our certified staff. Our expert trainers are ready to assign customized fitness plans.'}
          </p>
        </div>

        {trainers.length === 0 ? (
          // Fallback skeleton while loading or no trainers yet
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRAINER_PRESETS.slice(0, 3).map((preset, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
                <div className="w-full h-64 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-2 bg-white/10 rounded w-1/2" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer, idx) => {
              const preset = TRAINER_PRESETS[idx % TRAINER_PRESETS.length]
              return (
                <div
                  key={trainer.id}
                  className="bg-[#2a2a2a] rounded-2xl overflow-hidden border border-white/5 hover:-translate-y-1 transition duration-300"
                >
                  <img
                    src={preset.img}
                    alt={trainer.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ed563b]">
                      {preset.specialty}
                    </span>
                    <h4 className="text-lg font-black uppercase">
                      {trainer.name.toUpperCase()}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Join Us / Registration Section */}
      <section 
        id="join-us" 
        className="py-24 bg-[#1e1e1e]"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 30, 30, 0.9), rgba(30, 30, 30, 0.95)), url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left side Call to action */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ed563b]">Register Today</span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
                Become a member of our <span className="text-[#ed563b]">Gym</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Fill out the registration details to establish your profile. Once joined, a trainer will review your metrics and assign customized exercise targets and meal schedules.
              </p>
              <div className="flex flex-col gap-3 text-xs font-semibold text-slate-300 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#ed563b]">✔</span> Direct communication with certified trainers.
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#ed563b]">✔</span> Fully managed target weight and calorie tracking.
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#ed563b]">✔</span> Personal logs for workouts and diet tracking.
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="bg-[#2a2a2a]/95 rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-md">
              <h3 className="text-xl font-black uppercase mb-6 text-white border-b border-white/5 pb-3">Join The Studio</h3>
              
              {regSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-xs flex items-center gap-2 mb-6">
                  <span>✅</span> {regSuccess}
                </div>
              )}
              {regError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2 mb-6">
                  <span>⚠️</span> {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={regData.name}
                    onChange={handleRegChange}
                    required
                    placeholder="e.g. Shubham"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ed563b]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={regData.email}
                    onChange={handleRegChange}
                    required
                    placeholder="e.g. srvaghani22@gmail.com"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ed563b]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={regData.age}
                      onChange={handleRegChange}
                      required
                      placeholder="yrs"
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ed563b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Weight</label>
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={regData.weight}
                      onChange={handleRegChange}
                      required
                      placeholder="kg"
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ed563b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Height</label>
                    <input
                      type="number"
                      step="0.01"
                      name="height"
                      value={regData.height}
                      onChange={handleRegChange}
                      required
                      placeholder="m"
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ed563b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Create Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={regData.password}
                      onChange={handleRegChange}
                      required
                      placeholder="Min 6 characters"
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ed563b]"
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

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white transition duration-300 disabled:opacity-50 mt-2"
                >
                  {regLoading ? 'Joining...' : 'Become a Member'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <div className="w-full p-2 text-white">
            <Login 
              activeUser={null} 
              onLoginSuccess={(user) => {
                setShowLoginModal(false);
                onLoginSuccess(user);
              }} 
            />
          </div>
        </Modal>
      )}

    </div>
  )
}
