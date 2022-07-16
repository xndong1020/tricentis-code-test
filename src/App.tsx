import React, { FC, useEffect, useMemo, useState } from 'react'
import './App.css'
import SearchItemsList from './component/SearchItemsList'
import { RootResponse } from './typings/SearchResponse'
import axios from './utils/axios'

const ROTATION_SIZE = 5

const App: FC = () => {
  const initSearchItems = useMemo(() => ['A', 'B', 'C', 'D', 'E'], [])
  const [items, setItems] = useState(initSearchItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([] as string[])

  useEffect(() => {
    const init = () => {
      return setInterval(() => {
        setItems(prev => {
          if (searchResult.length === 0) {
            const [first, ...rest] = prev
            return [...rest, first]
          } else {
            const itemsFromInit = prev.filter(item =>
              initSearchItems.includes(item)
            )
            itemsFromInit.shift()
            if (itemsFromInit.length === 0) {
              setSearchResult(prev => {
                const [first, ...rest] = prev
                return [...rest, first]
              })
              return searchResult
            } else {
              return [
                ...itemsFromInit,
                ...searchResult.slice(0, ROTATION_SIZE - itemsFromInit.length)
              ]
            }
          }
        })
      }, 1000)
    }
    const timerId = init()
    return () => {
      clearInterval(timerId)
    }
  }, [initSearchItems, items, searchResult])

  useEffect(() => {
    const callApi = async () => {
      const collectionNamesFromSearch = await fetchApi(searchTerm)
      if (!!collectionNamesFromSearch)
        setSearchResult(collectionNamesFromSearch)
    }

    if (searchTerm) callApi()
  }, [searchTerm])

  const fetchApi = async (
    searchTerm: string
  ): Promise<string[] | undefined> => {
    try {
      const response = await axios.get<RootResponse>(
        `search?term=${searchTerm}`
      )
      const collectionNames = response.data.results
        .filter(x => typeof x !== 'undefined')
        .map(items => items.collectionName)
        .sort()
      console.log('collectionNames', collectionNames)
      return Array.from(new Set(collectionNames)).slice(0, ROTATION_SIZE)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    console.log('search', value)
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
