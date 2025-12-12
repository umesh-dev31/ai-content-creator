import { Search } from 'lucide-react'
import React from 'react'

function SearchSection({onSearchInput}:any) {
  return (
    <div className='p-10 bg-linear-to-br from-red-600 via-red-700
     to-red-800 flex flex-col justify-center items-center text-white'>
        <h2 className='text-3xl font-bold'>Browse All Templates</h2>
        <p className='text-red-100'>What would you like to create today?</p>
        <div className='w-full flex justify-center'>
             <div className='flex gap-2 items-center p-2 border border-white/20 rounded-lg
              bg-white text-black my-5 w-[50%]'>
                <Search className='text-gray-400'/>
                <input type='text' placeholder='Search' 
                onChange={(event)=>onSearchInput(event.target.value)}
                className='bg-transparent w-full outline-none'/>
             </div>
        </div>
    </div>
  )
}

export default SearchSection
