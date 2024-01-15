import { useEffect, useState, useContext } from 'react'
import './App.css'
import loaderImg from './assets/images/loader.png'
import PlanetCard from './components/PlanetCard'
import Header from './components/Header'

import { FiltersContext } from './context/filters'
import "@fontsource/inter";

import { assignSize } from './assets/utils/utils'
import Filters from './components/Filters'

let API_URL = 'https://swapi.dev/api/planets/'

function App() {
  const initialPlanetsData = JSON.parse(localStorage.getItem('swapiPlanets')) || [] // Initial planets Array

  const [planets, setPlanets] = useState(initialPlanetsData)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedPercentage, setLoadedPercentage] = useState(0)

  const {filters, sortSelection, setGeoData} = useContext(FiltersContext)

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
          <Filters planets={planets} setPlanets={setPlanets} />

          { filteredPlanets && filteredPlanets.length > 0 ? (
            <ul className='planetsList'>
              { filteredPlanets.map((planet, index) => {
                return <PlanetCard key={planet.name} planet={planet} sortSelection={sortSelection} />
              })}
            </ul>
          ) :
            <p className='no-results'>No planets in this database meet your criteria...</p>
          }
        </>
      }
    </>
  )
}

export default App
