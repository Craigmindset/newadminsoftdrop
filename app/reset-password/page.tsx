"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Set the session from access token
    const accessToken = searchParams.get('access_token')
    if (accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: ''
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!/^\d{6}$/.test(password)) {
      setError('Password must be 6 digits')
      return
    }

    try {
      setLoading(true)
      
      const { error: updateError } = await supabase.auth.updateUser({
        password
      })

      if (updateError) throw updateError
      
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again.')
      console.error('Reset error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new 6-digit password
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-green-600">Password updated successfully!</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New 6-digit password"
                  value={password}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setPassword(e.target.value)
                    }
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  required
                  className="h-12 text-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm 6-digit password"
                value={confirmPassword}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setConfirmPassword(e.target.value)
                  }
                }}
                maxLength={6}
                inputMode="numeric"
                required
                className="h-12 text-lg"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-medium"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
