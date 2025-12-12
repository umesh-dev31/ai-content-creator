"use client"
import React ,{useState} from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'

function Dashboard() {
  const[userSearchInput,setUserSearchInput]=useState<string>('');
  return (
    <div className='bg-black min-h-screen'>
      <div>
        {/*Search Bar**/}
        <SearchSection onSearchInput={(value:string)=>setUserSearchInput(value)}/>

        {/*Template List**/}
        <TemplateListSection userSearchInput={userSearchInput}/>
      </div>
    </div>
  )
}

export default Dashboard
