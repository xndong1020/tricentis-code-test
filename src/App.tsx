import React, { FC, useMemo, useState } from 'react'
import './App.css'
import SearchItemsList from './component/SearchItemsList'

const App: FC = () => {
  const initSearchItems = useMemo(() => ['A', 'B', 'C', 'D', 'E'], [])
  const [items, setItems] = useState(initSearchItems)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }
  return (
    <div className='app-container'>
      <input
        className='search-input'
        type='text'
        placeholder='Search Band'
        value={searchTerm}
        onChange={e => {
          handleSearch(e.target.value)
        }}
      />
      <SearchItemsList items={items} />
    </div>
  )
}

export default App
