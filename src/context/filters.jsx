import { createContext, useState } from "react"

export const FiltersContext = createContext()

export const FiltersProvider = ({children}) => {
  const [filters, setFilters] = useState({
    climate: '',
    terrain: '',
    minPopulation: 0,
    query: ''
  })
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortSelection, setSortSelection] = useState('')
  const [geoData, setGeoData] = useState({ // state to save all types of terrains, climates, etc
    climates: [],
    terrains: []
  })

  return(
    <FiltersContext.Provider value={
      {
        filters, setFilters, sortOrder, setSortOrder, sortSelection, setSortSelection, geoData, setGeoData
      }
    }>
      {children}
    </FiltersContext.Provider>
  )
}
