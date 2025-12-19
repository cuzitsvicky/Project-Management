import { X } from 'lucide-react'
import { Button } from './Button'

export function ConfirmDialog({ message, onConfirm, onCancel, isOpen }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Confirm Action</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}

