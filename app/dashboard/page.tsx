import { Search } from 'lucide-react'
import React from 'react'
import SearchSection from './_components/SearchSection'
import TemplateListSection from './_components/TemplateListSection'

function Dashboard() {
  return (
    <div>
      <div>
        {/*Search Bar**/}
        <SearchSection/>

        {/*Template List**/}
        <TemplateListSection/>
      </div>
    </div>
  )
}

export default Dashboard
