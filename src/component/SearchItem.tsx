import React, { FC, memo } from 'react'

interface SearchItemProps {
  item: string
}

const SearchItem: FC<SearchItemProps> = ({ item }) => {
  return <div className='item'>{item}</div>
}

export default memo(SearchItem)
