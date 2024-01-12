import { useEffect, useState } from 'react'
import './App.css'
import loaderImg from './assets/images/loader.png'
import PlanetCard from './components/PlanetCard'

let API_URL = 'https://swapi.dev/api/planets/'

function App() {
  const initialPlanetsData = JSON.parse(localStorage.getItem('swapiPlanets')) || [] // Initial planets Array

  const [planets, setPlanets] = useState(initialPlanetsData)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedPercentage, setLoadedPercentage] = useState(0)
  const [sortOrder, setSortOrder] = useState('asc')

  const [geoData, setGeoData] = useState({ // state to save all types of terrains, climates, etc
    climates: [],
    terrains: []
  })

  const [filters, setFilters] = useState({
    climate: '',
    terrain: '',
    minPopulation: 0,
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
          // const getPlanetSize = 
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
            planet_size: ''
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
      filteredData = filteredData.filter(item => parseInt(item.population, 10) > parseInt(filters.minPopulation, 10)) // TODO: Map data once planets fetched to avoid parding it later
    }

    if(!filters.climate && !filters.terrain  && !filters.minPopulation){
      return planets
    }

    return filteredData
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setLoadedPercentage(0)
    fetchAllPlanets()
  }

  const filteredPlanets = filterPlanets(planets)

  return (
    <>
      { isLoading &&
        <>
          <img src={loaderImg} alt="" className='loader' />
          <p>Travelling the galaxy gathering planets data... {loadedPercentage} %</p>
        </>
      }
      { !isLoading &&

        <>
          <h3>Filters</h3>
          <div className="filters">
            { geoData &&
              <>
                <select name="" id="" onChange={(e) => handleSelectClimate(e)}>
                  <option value="">-- Select Climate</option>
                  { geoData.climates.map(item => {
                    return <option key={item} value={item}>{item}</option>
                  }) }
                </select>

                <select name="" id="" onChange={(e) => handleSelectTerrain(e)}>
                  <option value="">-- Select Terrain</option>
                  { geoData.terrains.map(item => {
                    return <option key={item} value={item}>{item}</option>
                  }) }
                </select>

                <div>
                  <input
                    type="range"
                    min={0}
                    max={10000000000}
                    step="10000000"
                    value={filters.minPopulation}
                    style={{width: 500}}
                    onChange={(e) => handleRangeInput(e)}
                  />
                  {parseInt(filters.minPopulation, 10).toLocaleString()}
                </div>
              </>
            }
          </div>

          <h3>Sort by:</h3>
          <button onClick={() => handleSortPlanets('name')}>Alphabetically</button>
          <button onClick={() => handleSortPlanets('diameter')}>Diameter</button>
          <button onClick={() => handleSortPlanets('population')}>Population</button>

          <ul className='planetsList'>
              { filteredPlanets && filteredPlanets.length > 0 ? (
                filteredPlanets.map((planet, index) => {
                  return <PlanetCard key={planet.name} planet={planet} />
                })
              ) :
                <p>No planets known meet you criteria...</p>
              }
          </ul>
          <button onClick={handleRefresh}>Refresh</button>
        </>
      }
    </>
  )
}

export default App
