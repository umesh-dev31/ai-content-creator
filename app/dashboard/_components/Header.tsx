'use client'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Header() {
  return (
    <div className='p-5 shadow-sm border-b border-red-600/20 flex bg-black justify-end items-center'>
      <UserButton/>
    </div>
  )
}

export default Header
