import { useEffect, useState } from 'react'
import { getRoles, createRole, deleteRole } from '../api'
import Modal from '../components/Modal'
import RoleForm from '../components/RoleForm'

export default function Roles({ activeUser, users }) {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const res = await getRoles()
      setRoles(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreate = async (roleData) => {
    try {
      await createRole(roleData)
      setShowModal(false)
      fetchRoles()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role assignment?')) {
      try {
        await deleteRole(id)
        fetchRoles()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  // Filter roles based on selected user session
  const displayedRoles = activeUser
    ? roles.filter(r => r.user?.id === activeUser.id)
    : roles

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
            {activeUser ? `${activeUser.name}'s Roles` : 'Security Roles'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {activeUser 
              ? 'View system role permissions for this user.' 
              : 'Audit user roles and authorization properties across the system.'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl font-bold bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          + New Role
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {displayedRoles.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 bg-[#2a2a2a]">
          <span className="text-5xl block mb-4">🔑</span>
          <h3 className="text-xl font-bold text-white mb-1">No roles assigned</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Assign security roles to map users to application access layers.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 text-sm rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
          >
            Assign First Role
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/5 bg-[#2a2a2a] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#232323] border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role Name</th>
                  {!activeUser && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>}
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedRoles.map(role => (
                  <tr key={role.id} className="hover:bg-[#333333] transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 font-mono">#{role.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-[#ed563b]/15 text-[#ed563b] border border-[#ed563b]/30 px-2.5 py-1 rounded-md text-xs font-mono font-bold">
                        {role.roleName}
                      </span>
                    </td>
                    {!activeUser && (
                      <td className="px-6 py-4 text-sm font-medium text-slate-350">
                        {role.user ? role.user.name : <span className="text-slate-500 italic">Unassigned</span>}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition duration-200"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <RoleForm 
            users={users}
            activeUser={activeUser}
            onSubmit={handleCreate} 
          />
        </Modal>
      )}
    </div>
  )
}
