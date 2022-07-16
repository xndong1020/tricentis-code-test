import React, { FC, useEffect, useMemo, useState } from 'react'
import './App.css'
import SearchItemsList from './component/SearchItemsList'
import useDebounce from './hooks/useDebounce'
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
          // if no api calls happened hence no query results, then shuffle default items
          if (searchResult.length === 0) {
            const [first, ...rest] = prev
            return [...rest, first]
          } else {
            const itemsFromInit = prev.filter(item =>
              initSearchItems.includes(item)
            )
            itemsFromInit.shift()
            // if no default items left, then shuffle query results
            if (itemsFromInit.length === 0) {
              setSearchResult(prev => {
                const [first, ...rest] = prev
                return [...rest, first]
              })
              return searchResult
            } else {
              // calculate how many elements are left from default items, and how many elements from query results need to append to bottom
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

  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    const callApi = async () => {
      const collectionNamesFromSearch = await fetchApi(debouncedSearch)
      if (!!collectionNamesFromSearch)
        setSearchResult(collectionNamesFromSearch)
    }
    // debounced api call for better performance
    if (debouncedSearch) callApi()
  }, [debouncedSearch])

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
      return Array.from(new Set(collectionNames)).slice(0, ROTATION_SIZE)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSearch = (value: string): void => {
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
