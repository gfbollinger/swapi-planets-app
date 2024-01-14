import { useEffect, useState } from 'react'
import './App.css'
import loaderImg from './assets/images/loader.png'
import PlanetCard from './components/PlanetCard'
import Header from './components/Header'
import "@fontsource/inter";

import { assignSize } from './assets/utils/utils'

let API_URL = 'https://swapi.dev/api/planets/'

function App() {
  const initialPlanetsData = JSON.parse(localStorage.getItem('swapiPlanets')) || [] // Initial planets Array

  const [planets, setPlanets] = useState(initialPlanetsData)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedPercentage, setLoadedPercentage] = useState(0)
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortSelection, setSortSelection] = useState('')

  const [geoData, setGeoData] = useState({ // state to save all types of terrains, climates, etc
    climates: [],
    terrains: []
  })

  const [filters, setFilters] = useState({
    climate: '',
    terrain: '',
    minPopulation: 0,
    query: ''
  })

  const fetchAllPlanets = async () => { // Function to fetch all planets
    try {
      let allPlanets = []
      let nextPage = API_URL
      let planetsCount = 0

      while (nextPage) {
        const response = await fetch(nextPage)
        const data = await response.json()
        const arrangedData = data.results.map( item => { // Map data to have it organized the way is needed later (example numbers)
          return {
            name: item.name.toLowerCase(),
            rotation_period: item.rotation_period === 'unknown' ? -1 : parseInt(item.rotation_period, 10),
            orbital_period: item.orbital_period === 'unknown' ? -1 : parseInt(item.orbital_period, 10),
            diameter: item.diameter === 'unknown' ? -1 : parseInt(item.diameter, 10),
            climate: item.climate,
            gravity: item.gravity,
            terrain: item.terrain,
            surface_water: item.surface_water === 'unknown' ? -1 : parseInt(item.surface_water, 10),
            population: item.population === 'unknown' ? -1 : parseInt(item.population, 10),
            residents: item.residents,
            films: item.films,
            url: item.url,
            planet_size: assignSize(item.diameter === 'unknown' ? -1 : parseInt(item.diameter, 10), 4) // Used just to display size representation as an image
          }
        })
        console.log(arrangedData, data.results)
        allPlanets = [...allPlanets, ...arrangedData]
        nextPage = data.next // Update next page with next from response
        planetsCount = data.count
        console.log(data.next)

        const getPercentage = () => allPlanets.length * 100 / planetsCount
        setLoadedPercentage(getPercentage().toFixed(2))

      }
      localStorage.setItem('swapiPlanets', JSON.stringify(allPlanets)) // Save result to localStorage
      setPlanets(allPlanets)
      setIsLoading(false)


    } catch (error) {
      console.error('Error fetching planets:', error)
    }
  };

  useEffect(() => {
    // If planets aren´t in localStorage, fetch them from API
    let planetsCount = 0

    const fetchApi = async () =>{ // Fetch API to check planets count
      try{
        const response = await fetch(API_URL)
        const data = await response.json()
        planetsCount = data.count
      }
      catch(error){
        console.error('Error fetching planets:', error)
      }

      if (planets.length != planetsCount){ // This is used to see if planets in localStorage are the same amount than in the API
        fetchAllPlanets();
      } else {
        setIsLoading(false)
        mapGeoData()
      }
    }

    fetchApi()

  }, []);

  const mapGeoData = () => {
    // Create arrays of unique values for climate and terrain
    const uniqueClimates = [...new Set(planets
      .flatMap(item => item.climate.split(',')
        .map(climate => climate.trim())
      ).sort()
    )]

    const uniqueTerrains = [...new Set(planets
      .flatMap(item => item.terrain.split(',')
        .map(terrain => terrain.trim())
      ).sort()
    )]

    setGeoData({
      climates: uniqueClimates,
      terrains: uniqueTerrains
    })
  }

  const handleSelectTerrain = (e) => {
    setFilters(prevState => {
      return {
        ...prevState,
        terrain: e.target.value
      }
    })
  }

  const handleSelectClimate = (e) => {
    setFilters(prevState => {
      return {
        ...prevState,
        climate: e.target.value
      }
    })
  }

  const handleRangeInput = (e) => {
    setFilters(prevState => {
      return {
        ...prevState,
        minPopulation: parseInt(e.target.value, 10)
      }
    })
  }

  const handleSearchQuery = (e) => {
    setFilters(prevState => {
      return {
        ...prevState,
        query: e.target.value
      }
    })
  }

  const sortData = (data, param, order) => {
    const newData = [...data]
    const newPlanetsArr = newData.sort(function(a,b) {
      if(a[param] > b[param]){
        return order === 'asc' ? 1 : -1
      }
      if (a[param] < b[param]) {
        return order === 'asc' ? -1 : 1
      }
      return 0
    })
    return newPlanetsArr
  }

  const handleSortPlanets = (by) => {
    const newSortOrder = sortOrder === 'asc' ? 'des' : 'asc'
    setSortOrder(newSortOrder)
    const sortedArr = sortData(planets, by, newSortOrder)
    setPlanets(sortedArr)
    setSortSelection(by)
  }

  const filterPlanets = (p) => {
    let filteredData = [...p]

    if(filters.terrain){
      filteredData = filteredData.filter(item => item.terrain.includes(filters.terrain))
    }

    if(filters.climate){
      filteredData = filteredData.filter(item => item.climate.includes(filters.climate))
    }

    if(filters.minPopulation){
      filteredData = filteredData.filter(item => parseInt(item.population, 10) > parseInt(filters.minPopulation, 10))
    }

    if(filters.query){
      const query = filters.query.toLowerCase()
      filteredData = filteredData.filter(item => item.name.toLowerCase().includes(query) )
    }

    if(!filters.climate && !filters.terrain  && !filters.minPopulation && !filters.query){
      return planets
    }

    return filteredData
  }

  const removeFilter = (filter) => {
    if (filter === 'minPopulation'){
      setFilters(prevState => {
        return {
          ...prevState,
          minPopulation: 0
        }
      })
    }
    else {
      setFilters(prevState => {
        return {
          ...prevState,
          [filter]: ''
        }
      })
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setLoadedPercentage(0)
    fetchAllPlanets()
  }

  const filteredPlanets = filterPlanets(planets)

  return (
    <>
      <Header />
      { isLoading &&
        <div className='mainLoader'>
          <div className="loader"><img src={loaderImg} alt="" /></div>
          <p>Travelling the galaxy gathering planets data... {loadedPercentage} %</p>
        </div>
      }

      { !isLoading &&
        <>
          <div className="filtersContainer">
            <h3>Filter by:</h3>
            <div className="filters">
              { geoData &&
                <>
                  <div className='filterItem'>
                    <span>Climate</span>
                    <select onChange={(e) => handleSelectClimate(e)} value={filters.climate}>
                      <option value="">-- Select Climate</option>
                      { geoData.climates.map(item => {
                        return <option key={item} value={item}>{item}</option>
                      }) }
                    </select>
                  </div>

                  <div className='filterItem'>
                    <span>Terrain</span>
                    <select onChange={(e) => handleSelectTerrain(e)} value={filters.terrain}>
                      <option value="">-- Select Terrain</option>
                      { geoData.terrains.map(item => {
                        return <option key={item} value={item}>{item}</option>
                      }) }
                    </select>
                  </div>

                  <div className='filterItem'>
                    <span>Min. Population</span>
                    <input
                      className='minPopulation'
                      type="range"
                      min={0}
                      max={10000000000}
                      step="10000000"
                      value={filters.minPopulation}
                      onChange={(e) => handleRangeInput(e)}
                    />
                    <div className="minPopulationLabel">{filters.minPopulation.toLocaleString()}</div>
                  </div>
                </>
              }
            </div>
            <div className="filtersApplied">
              {filters.climate || filters.terrain || filters.minPopulation ? (
                <p>Filters Applied:</p>
              ) : null}
              { filters.climate &&
                <div className="badge"><strong>Climate: </strong>{filters.climate} <button onClick={() => removeFilter('climate')}>&times;</button></div>
              }

              { filters.terrain &&
                <div className="badge"><strong>Terrain:</strong> {filters.terrain} <button onClick={() => removeFilter('terrain')}>&times;</button></div>
              }

              { filters.minPopulation >= 1 &&
                <div className="badge"><strong>Min pop:</strong> {filters.minPopulation.toLocaleString()} <button onClick={() => removeFilter('minPopulation')}>&times;</button></div>
              }
            </div>

            <div className="searchSortContainer">
              <div className="searchControls">
                <h3>Search</h3>
                <div className="filterItem">
                  <label htmlFor="searchQuery">Search</label>
                  <input
                    type="text"
                    id='searchQuery'
                    value={filters.query}
                    onChange={(e) => handleSearchQuery(e)}
                    placeholder='Type the planet name...'
                  />
                </div>
              </div>

              <div className="sortBy-controls">
                <h3>Sort by:</h3>
                <div className="sortBy-buttons">
                  <button onClick={() => handleSortPlanets('name')} className={sortSelection === 'name' ? 'active' : ''}>Alphabetically</button>
                  <button onClick={() => handleSortPlanets('diameter')} className={sortSelection === 'diameter' ? 'active' : ''}>Diameter</button>
                  <button onClick={() => handleSortPlanets('population')} className={sortSelection === 'population' ? 'active' : ''}>Population</button>
                </div>
              </div>
            </div>

            <div className='refreshContainer'>
              <button onClick={handleRefresh}>Refresh all data</button>
            </div>
          </div>

          { filteredPlanets && filteredPlanets.length > 0 ? (
            <ul className='planetsList'>
              { filteredPlanets.map((planet, index) => {
                return <PlanetCard key={planet.name} planet={planet} />
              })}
            </ul>
          ) :
            <p className='no-results'>No planets known meet you criteria...</p>
          }
        </>
      }
    </>
  )
}

export default App
