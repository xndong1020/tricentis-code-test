import React, { FC, memo } from 'react'
import SearchItem from './SearchItem'

interface SearchItemsListProps {
  items: string[]
}

const SearchItemsList: FC<SearchItemsListProps> = ({ items }) => {
  return (
    <div className='lists'>
      {items &&
        items.map((item, index) => <SearchItem item={item} key={item} />)}
    </div>
  )
}

export default memo(SearchItemsList)
