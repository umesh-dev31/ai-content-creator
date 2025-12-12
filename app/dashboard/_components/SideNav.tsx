"use client"
import React, { use, useEffect } from 'react'
import Image from 'next/image'
import { FileClock, Home, icons, Settings, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'
import UsageTrack from './UsageTrack'
import Link from 'next/link'

function SideNav() {

    const MenuList=[
        {
            name:'Home',
            icons:Home ,
            path:'/dashboard'
        },{
            name:'History',
            icons:FileClock ,
            path:'/dashboard/history'
        }, {
            name:'Billing',
            icons:WalletCards ,
            path:'/dashboard/billing'
        }, {
            name:'Setting',
            icons:Settings ,
            path:'/dashboard/settings'
        }, 
    ]
    const path=usePathname();
    useEffect(()=>{
        console.log(path);
    },[])


  return (
    <div className='h-screen p-5 shadow-sm border-r border-red-600/20 bg-black relative'>
        <div className='flex justify-center'>
        <div className='w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center'>
          <Image src={'/logo.svg'} alt='Logo' width={40} height={40} />
        </div>
        </div>
        <hr className='my-5 border-red-600/20'/>
        <div className='mt-10'>
            {MenuList.map((menu,index)=>(
                <Link
                    key={menu.path}
                    href={menu.path}
                    className={`flex gap-2 mb-2 p-3 hover:bg-red-600
                    hover:text-white rounded-lg transition-colors
                    cursor-pointer items-center ${path==menu.path ? "bg-red-600 text-white" : "text-gray-400"}`}
                >
                    <menu.icons />
                    <h2>{menu.name}</h2>
                </Link>
            ))}
        </div>
        <div className='absolute bottom-10 left-0 w-full'>
            <UsageTrack />
        </div>
    </div>
  )
}

export default SideNav
