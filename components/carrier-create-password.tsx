"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpCarrier } from '../actions/carrier-auth'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function CarrierCreatePassword({ phone }: { phone: string }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await signUpCarrier(phone, password)

      if (error) throw error

      // Redirect to KYC verification after successful signup
      router.push('/signup/carrier/kyc')
    } catch (err: any) {
      setError(err.message || 'Account creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create Password</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="6-digit password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>
    </div>
  )
}
