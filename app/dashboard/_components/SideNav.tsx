import React from 'react'
import Image from 'next/image'
import { FileClock, Home, icons, Settings, WalletCards } from 'lucide-react'

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

  return (
    <div className='h-screen p-5 shadow-sm border'>
        <div className='flex justify-center'>
        <Image src={'/logo.svg'} alt='Logo' width={40} height={40} />
        </div>
        <div>
            {MenuList.map((menu,index)=>(
                <div className='flex gap-2 mb-2 p-3 hover:bg-primary
                hover:text-white rounded-lg'>
                    <menu.icons />
                    <h2>{menu.name}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SideNav
