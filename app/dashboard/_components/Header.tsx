import { Search } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div>
      <div>
        <Search />
        <input type='text' placeholder='Search...' />
      </div>
    </div>
  )
}

export default Header
