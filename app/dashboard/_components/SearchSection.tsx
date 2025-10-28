import { Search } from 'lucide-react'
import React from 'react'

function SearchSection() {
  return (
    <div className='p-10 bg-linear-to-br from-purple-500 via-purple-700
     to-blue-600 flex flex-col justify-center items-center text-white'>
        <h2 className='text-3xl font-bold'>Browse All Templates</h2>
        <p>What would you like to create today?</p>
        <div className='w-full flex justify-center'>
             <div className='flex gap-2 items-center p-2 border rounded
              medium bg-white text-black my-5 w-[30%]'>
                <Search/>
                <input type='text' placeholder='Search' 
                className='bg-transparent w-full outline-none'/>

             </div>
        </div>
    </div>
  )
}

export default SearchSection
