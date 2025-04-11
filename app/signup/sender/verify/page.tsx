"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function VerifyPhone() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const isResetFlow = searchParams.get('reset') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) return

    try {
      setLoading(true)
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms'
      })

      if (verifyError) throw verifyError

      // Handle password reset flow
      if (isResetFlow) {
        return router.push(`/reset-password?access_token=${data.session?.access_token}`)
      }

      // Normal signup flow
      router.push(`/signup/sender/create-password?phone=${encodeURIComponent(phone)}`)
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={24} className="text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-2">
            {isResetFlow ? 'Reset Password' : 'Verify Phone Number'}
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Enter the 6-digit code sent to {phone}
        </p>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mx-4 flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="h-14 w-12 sm:w-14 text-center text-2xl"
                required
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-medium"
            disabled={otp.some(d => d === '') || loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </div>
    </div>
  )
}
