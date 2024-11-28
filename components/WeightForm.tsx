'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ToastProvider"

export function WeightForm() {
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const { error } = await supabase
      .from('weights')
      .insert({ user_id: user.id, weight: parseFloat(weight) })

    if (error) {
      showToast(error.message, "error")
    } else {
      showToast("Weight recorded successfully", "success")
      setWeight('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        step="0.1"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        Record Weight
      </Button>
    </form>
  )
}

