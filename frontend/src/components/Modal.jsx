export default function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#2a2a2a] border border-white/10 rounded-3xl p-6 w-full max-w-md relative shadow-2xl shadow-black/60 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-450 hover:text-white text-2xl transition duration-200"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
