import React from 'react'
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 p-4 rounded-md shadow-md",
        type === 'success' ? "bg-green-500" : "bg-red-500",
        "text-white"
      )}
    >
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  )
}

