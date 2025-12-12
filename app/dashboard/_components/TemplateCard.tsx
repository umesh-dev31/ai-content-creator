import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image'
import Link from 'next/link'

function TemplateCard(item:TEMPLATE) {
  return (
    <Link href={`/dashboard/content/${item.slug}`}>
    <div className='p-5 shadow-md rounded-md border border-white/20
     bg-neutral-900 hover:bg-neutral-800 flex flex-col gap-3 cursor-pointer hover:scale-105 transition-all hover:border-red-600/50'>
      <Image src={item.icon} alt='icon' width={50} height={50} />
        <h2 className='font-medium text-lg text-white'>{item.name}</h2>
        <p className='text-gray-400 line-clamp-3'>{item.desc}</p>
    </div>
    </Link>
  )
}

export default TemplateCard
