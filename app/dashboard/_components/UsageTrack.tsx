'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

interface UsageData {
  used: number
  total: number
  percentage: string
  totalGenerations: number
  totalCharacters: number
}

function UsageTrack() {
  const { user, isLoaded } = useUser()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUsage()
    }
  }, [isLoaded, user])

  const fetchUsage = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/usage')
      const data = await response.json()
      
      if (data.success) {
        setUsage(data.data)
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    } finally {
      setLoading(false)
    }
  }

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
        <Button variant={'secondary'} className='w-full my-3'>Upgrade</Button>
      </div>
    )
  }

  return (
    <div className='m-5'>
      <div className='bg-primary text-white rounded-lg p-2'>
        <h2 className='font-medium'>Credits</h2>
        <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
          <div 
            className='h-2 bg-white rounded-full transition-all duration-300' 
            style={{ width: `${usage.percentage}%` }}
          ></div>
        </div>
        <h2 className='text-sm my-2'>
          {usage.used.toLocaleString()}/{usage.total.toLocaleString()} Credits Used
        </h2>
      </div>
      <Button variant={'secondary'} className='w-full my-3'>Upgrade</Button>
    </div>
  )
}

export default UsageTrack
