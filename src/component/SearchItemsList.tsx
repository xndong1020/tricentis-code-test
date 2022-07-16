import React, { FC } from 'react'
import SearchItem from './SearchItem'

interface SearchItemsListProps {
  items: string[]
}

const SearchItemsList: FC<SearchItemsListProps> = ({ items }) => {
  return (
    <div className="lists">
      {items &&
        items.map((item, index) => <SearchItem item={item} key={index} />)}
    </div>
  )
}

export default SearchItemsList
