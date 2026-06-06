import { useState } from 'react'
import { createUser, updateUser, deleteUser, createRole, updateRole, getRoles } from '../api'
import Modal from '../components/Modal'
import UserForm from '../components/UserForm'

// Role badge style helper
const roleBadge = (roleName) => {
  if (!roleName) return { label: 'No Role', cls: 'bg-white/5 text-slate-400 border-white/10' }
  if (roleName.includes('ADMIN'))   return { label: '🛡️ Admin',   cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }
  if (roleName.includes('TRAINER')) return { label: '🏋️ Trainer', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' }
  return { label: '👤 Member', cls: 'bg-[#ed563b]/15 text-[#ed563b] border-[#ed563b]/30' }
}

export default function Users({ activeUser, onUsersChange, users }) {
  const [error, setError]             = useState(null)
  const [showModal, setShowModal]     = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Role edit modal state
  const [roleModal, setRoleModal]     = useState(false)
  const [roleTarget, setRoleTarget]   = useState(null) // { user, existingRole }
  const [roleLoading, setRoleLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('ROLE_USER')

  // ── Create user + assign role ──────────────────────────────────────
  const handleCreate = async (userData, role) => {
    try {
      // Pass the role directly in the User payload's 'r' field
      await createUser({
        ...userData,
        r: [{ roleName: role }]
      })
      setShowModal(false)
      if (onUsersChange) onUsersChange()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  // ── Update user profile ────────────────────────────────────────────
  const handleUpdate = async (userData, role) => {
    try {
      await updateUser(selectedUser.id, userData)
      // Also update role if it changed
      const existingRole = selectedUser.r && selectedUser.r[0]
      const currentRoleName = existingRole ? existingRole.roleName : null
      if (role !== currentRoleName) {
        if (existingRole) {
          // Update existing role record
          await updateRole(existingRole.id, { roleName: role, user: { id: selectedUser.id } })
        } else {
          // Create new role if none existed
          await createRole({ roleName: role, user: { id: selectedUser.id } })
        }
      }
      setShowModal(false)
      setSelectedUser(null)
      if (onUsersChange) onUsersChange()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  // ── Delete user ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their logged workouts, meals, and goals will be removed.')) {
      try {
        await deleteUser(id)
        if (onUsersChange) onUsersChange()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  // ── Open role-change modal ─────────────────────────────────────────
  const openRoleModal = (user) => {
    const existingRole = user.r && user.r[0] ? user.r[0].roleName : 'ROLE_USER'
    setRoleTarget(user)
    setSelectedRole(existingRole)
    setRoleModal(true)
  }

  // ── Save role change ───────────────────────────────────────────────
  const handleRoleSave = async () => {
    setRoleLoading(true)
    try {
      const existingRole = roleTarget.r && roleTarget.r[0]
      if (existingRole) {
        await updateRole(existingRole.id, { roleName: selectedRole, user: { id: roleTarget.id } })
      } else {
        await createRole({ roleName: selectedRole, user: { id: roleTarget.id } })
      }
      setRoleModal(false)
      setRoleTarget(null)
      if (onUsersChange) onUsersChange()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setRoleLoading(false)
    }
  }

  const roleOptions = [
    { value: 'ROLE_USER',    label: '👤 Member',  desc: 'Tracks workouts, meals & goals' },
    { value: 'ROLE_TRAINER', label: '🏋️ Trainer', desc: 'Manages member data & plans' },
  ]

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Member Management</h1>
          <p className="text-slate-400 text-sm mt-1">Register, edit, delete members and manage their roles.</p>
        </div>
        <button
          onClick={() => { setSelectedUser(null); setShowModal(true) }}
          className="px-5 py-3 rounded-xl font-bold bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          + New Member
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">✕</button>
        </div>
      )}

      {users.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 bg-[#2a2a2a]">
          <span className="text-5xl block mb-4">👥</span>
          <h3 className="text-xl font-bold text-white mb-1">No members registered</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Get started by registering your first member profile.
          </p>
          <button
            onClick={() => { setSelectedUser(null); setShowModal(true) }}
            className="px-4 py-2.5 text-sm rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/5 bg-[#2a2a2a] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#232323] border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">BMI</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => {
                  const bmi = user.height > 0 ? (user.weight / (user.height * user.height)).toFixed(1) : 0
                  const isCurrentSession = activeUser?.id === user.id
                  const userRoleName = user.r && user.r[0] ? user.r[0].roleName : null
                  const badge = roleBadge(userRoleName)

                  return (
                    <tr
                      key={user.id}
                      className={`transition duration-150 border-b border-white/5 last:border-0 ${
                        isCurrentSession
                          ? 'bg-orange-500/10 hover:bg-orange-500/15'
                          : 'hover:bg-[#333333]/50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 font-mono">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white flex items-center gap-1.5">
                            {user.name}
                            {isCurrentSession && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ed563b]/20 text-[#ed563b] border border-[#ed563b]/30 animate-pulse">
                                You
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                      </td>

                      {/* Role cell with change button */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                            {badge.label}
                          </span>
                          {/* Don't allow changing admin's own role */}
                          {!userRoleName?.includes('ADMIN') && (
                            <button
                              onClick={() => openRoleModal(user)}
                              className="text-[10px] font-bold text-slate-400 hover:text-[#ed563b] underline underline-offset-2 transition"
                            >
                              change
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300 font-medium">{user.age} yrs</td>
                      <td className="px-6 py-4 text-sm text-slate-300 font-medium">{user.weight} kg</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#ed563b]">{bmi > 0 ? bmi : '--'}</td>
                      <td className="px-6 py-4 text-sm text-right space-x-2">
                        <button
                          onClick={() => { setSelectedUser(user); setShowModal(true) }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Member Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UserForm
            user={selectedUser}
            onSubmit={selectedUser ? handleUpdate : handleCreate}
          />
        </Modal>
      )}

      {/* Change Role Modal */}
      {roleModal && roleTarget && (
        <Modal onClose={() => { setRoleModal(false); setRoleTarget(null) }}>
          <div className="space-y-6 bg-transparent text-white p-1">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-2xl font-black uppercase text-white">Change Role</h2>
              <p className="text-slate-400 text-sm mt-1">
                Updating role for <span className="text-white font-bold">{roleTarget.name}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedRole(opt.value)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    selectedRole === opt.value
                      ? 'border-[#ed563b] bg-[#ed563b]/10 shadow-sm shadow-orange-950/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                  {selectedRole === opt.value && (
                    <div className="mt-1.5 text-[9px] font-extrabold text-[#ed563b] uppercase tracking-wider">✓ Selected</div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRoleSave}
                disabled={roleLoading}
                className="flex-1 py-3 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {roleLoading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> Saving...</>
                ) : (
                  'Save Role'
                )}
              </button>
              <button
                onClick={() => { setRoleModal(false); setRoleTarget(null) }}
                className="px-5 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
