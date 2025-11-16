"use client"
import React, { use, useEffect } from 'react'
import Image from 'next/image'
import { FileClock, Home, icons, Settings, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'
import UsageTrack from './UsageTrack'

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
            path:'/dashboard/setting'
        }, 
    ]
    const path=usePathname();
    useEffect(()=>{
        console.log(path);
    },[])


  return (
    <div className='h-screen p-5 shadow-sm border bg-white relative'>
        <div className='flex justify-center'>
        <Image src={'/logo.svg'} alt='Logo' width={40} height={40} />
        </div>
        <hr className='my-5 border'/>
        <div className='mt-10'>
            {MenuList.map((menu,index)=>(
                <div
                    className={`flex gap-2 mb-2 p-3 hover:bg-primary
                    hover:text-white rounded-lg
                    cursor-pointer items-center ${path==menu.path ? "bg-primary text-white" : ""}`}
                >
                    <menu.icons />
                    <h2>{menu.name}</h2>
                </div>
            ))}
        </div>
        <div className='absolute bottom-10 left-0 w-full'>
            <UsageTrack />
        </div>
    </div>
  )
}

export default SideNav
