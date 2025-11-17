"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import axios from 'axios'

declare global {
  interface Window {
    Razorpay?: any
  }
}

async function loadRazorpayScript() {
  if (typeof window === 'undefined') return false

  if (document.getElementById('razorpay-sdk')) {
    return true
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.id = 'razorpay-sdk'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function BillingPage() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onPayment = async (subId: string) => {
    const sdkLoaded = await loadRazorpayScript()
    if (!sdkLoaded || !window.Razorpay) {
      setErrorMessage('Unable to load Razorpay payment SDK.')
      return
    }

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    if (!key) {
      setErrorMessage('NEXT_PUBLIC_RAZORPAY_KEY_ID is not set in .env.local')
      return
    }

    const options = {
      key,
      subscription_id: subId,
      name: 'UMESHCHW',
      description: 'Yearly Subscription',
      handler: async (resp: any) => {
        console.log('Razorpay payment success:', resp)
        setSuccessMessage('Subscription payment completed successfully.')
      },
      theme: {
        color: '#000000',
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  
  const CreateSubscription = async () => {
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const resp = await axios.post('/api/create-subscription', {})
      console.log('Subscription created:', resp.data)
      await onPayment(resp.data.id)
    } catch (error: any) {
      console.error('Subscription error:', error)
      const serverMessage =
        error?.response?.data?.error || 'Failed to create subscription.'
      setErrorMessage(serverMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upgrade With Yearly Plan</h1>
        </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Free Plan Card */}
        <div className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">0$</span>
              <span className="text-gray-600">/month</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">10,000 Words/Month</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">50+ Content Templates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Unlimited Download & Copy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">1 Month of History</span>
            </div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            disabled
          >
            Currently Active Plan
          </Button>
        </div>

        {/* Monthly Plan Card */}
        <div className="bg-white border-2 border-primary rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Monthly</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                <span className="bg-white px-2 py-1 rounded text-primary">9.99</span>
              </span>
              <span className="text-gray-600">$/year</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">1,00,000 Words/Month</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">50+ Template Access</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Unlimited Download & Copy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">1 Year of History</span>
            </div>
          </div>

          <Button 
            onClick={CreateSubscription}
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary hover:text-white"
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Get Started'}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-destructive mt-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 mt-4">{successMessage}</p>
      )}
    </div>
  )
}

export default BillingPage
