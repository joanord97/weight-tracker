'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ToastProvider"

export function MeasurementsForm() {
  const [measurements, setMeasurements] = useState({
    stomach: '',
    arm: '',
    leg: '',
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeasurements({
      ...measurements,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const { error } = await supabase
      .from('measurements')
      .insert({
        user_id: user.id,
        stomach: parseFloat(measurements.stomach),
        arm: parseFloat(measurements.arm),
        leg: parseFloat(measurements.leg),
      })

    if (error) {
      showToast(error.message, "error")
    } else {
      showToast("Measurements recorded successfully", "success")
      setMeasurements({ stomach: '', arm: '', leg: '' })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold mb-4">Record Measurements</h2>
      <Input
        type="number"
        step="0.1"
        name="stomach"
        placeholder="Stomach circumference (cm)"
        value={measurements.stomach}
        onChange={handleChange}
        required
      />
      <Input
        type="number"
        step="0.1"
        name="arm"
        placeholder="Arm circumference (cm)"
        value={measurements.arm}
        onChange={handleChange}
        required
      />
      <Input
        type="number"
        step="0.1"
        name="leg"
        placeholder="Leg circumference (cm)"
        value={measurements.leg}
        onChange={handleChange}
        required
      />
      <Button type="submit" disabled={loading}>
        Record Measurements
      </Button>
    </form>
  )
}

