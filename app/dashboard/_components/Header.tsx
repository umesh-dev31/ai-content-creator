import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div className='p-5 shadow-sm border-b-2 flex bg-white justify-between items-center'>
      <div className='flex gap-2 items-center p-2 border rounded-md max-w-lg bg-white'>
        <Search />
        <input type='text' placeholder='Search...'  className='outline-none'/>
      </div>
      <UserButton/>
    </div>
  )
}

export default Header
