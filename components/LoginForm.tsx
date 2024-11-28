'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ToastProvider"

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showToast(error.message, "error")
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      showToast(error.message, "error")
    } else {
      showToast("Check your email for the confirmation link", "success")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          Log In
        </Button>
        <Button type="button" variant="outline" onClick={handleSignUp} disabled={loading}>
          Sign Up
        </Button>
      </div>
    </form>
  )
}

