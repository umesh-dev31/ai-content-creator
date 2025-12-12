import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='flex items-center justify-center h-full bg-black min-h-screen p-8'>
      <UserProfile/>
    </div>
  )
}

export default page
