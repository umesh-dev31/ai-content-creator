'use client'
import { Button } from '@/components/ui/button'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import Link from 'next/link'

interface UsageData {
  used: number
  total: number
  percentage: number
  totalGenerations: number
  totalCharacters: number
  isSubscribed: boolean
}

function UsageTrack() {
  const { user, isLoaded } = useUser()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const subscriptionContext = useContext(UserSubscriptionContext)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUsage()
    }
  }, [isLoaded, user])

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/usage')
      const data = await response.json()
      
      if (data.success) {
        const payload = data.data
        setUsage({
          used: payload.used,
          total: payload.total,
          percentage: Number(payload.percentage),
          totalGenerations: payload.totalGenerations,
          totalCharacters: payload.totalCharacters,
          isSubscribed: payload.isSubscribed ?? false,
        })
        subscriptionContext?.setUserSubscription(payload.isSubscribed ?? false)
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    } finally {
      setLoading(false)
    }
  }, [subscriptionContext])

  useEffect(() => {
    if (isLoaded && user) {
      fetchUsage()
    }
  }, [isLoaded, user, fetchUsage])

  useEffect(() => {
    const handleUsageUpdated = () => {
      if (isLoaded && user) {
        fetchUsage()
      }
    }

    window.addEventListener('usageUpdated', handleUsageUpdated)
    return () => {
      window.removeEventListener('usageUpdated', handleUsageUpdated)
    }
  }, [fetchUsage, isLoaded, user])

  if (loading || !usage) {
    return (
      <div className='m-5'>
        <div className='bg-primary text-white rounded-lg p-2'>
          <h2 className='font-medium'>Credits</h2>
          <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
            <div className='h-2 bg-white rounded-full' style={{ width: '0%' }}></div>
          </div>
          <h2 className='text-sm my-2'>Loading...</h2>
        </div>
        <Link href="/dashboard/billing">
          <Button
            suppressHydrationWarning
            variant={'secondary'}
            className='w-full my-3'
          >
            Upgrade
          </Button>
        </Link>
      </div>
    )
  }

  const isSubscribed =
    subscriptionContext?.userSubscription ?? usage.isSubscribed
  const totalLimit = isSubscribed ? 100000 : usage.total
  const usagePercentage = Math.min((usage.used / totalLimit) * 100, 100)

  return (
    <div className='m-5'>
      <div className='bg-primary text-white rounded-lg p-2'>
        <h2 className='font-medium'>Credits</h2>
        <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
          <div 
            className='h-2 bg-white rounded-full transition-all duration-300' 
            style={{ width: `${usagePercentage.toFixed(1)}%` }}
          ></div>
        </div>
        <h2 className='text-sm my-2'>
          {usage.used.toLocaleString()}/{totalLimit.toLocaleString()} Credits Used
        </h2>
      </div>
      <Link href="/dashboard/billing">
        <Button
          suppressHydrationWarning
          variant={'secondary'}
          className='w-full my-3'
        >
          Upgrade
        </Button>
      </Link>
    </div>
  )
}

export default UsageTrack
