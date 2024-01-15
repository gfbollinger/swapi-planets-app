import React, {useContext} from 'react'
import {FiltersContext} from '../context/filters'

const Filters = ({planets, setPlanets}) => {
  const {filters, setFilters, sortOrder, setSortOrder, sortSelection, setSortSelection, geoData, setGeoData} = useContext(FiltersContext)

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

  const handleSortPlanets = (by) => {
    const newSortOrder = sortOrder === 'asc' ? 'des' : 'asc'
    setSortOrder(newSortOrder)
    const sortedArr = sortData(planets, by, newSortOrder)
    setPlanets(sortedArr)
    setSortSelection(by)
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

  const sortData = (data, param, order) => {
    const newData = [...data]
    const newPlanetsArr = newData.sort(function(a,b) {
      // Move to the end elems that has -1 val (items with unknown value)
      if (a[param] === -1 || a[param] === 0) {
        return 1;
      }
      if (b[param] === -1 || b[param] === 0) {
          return -1;
      }

      // Compare other values
      if (a[param] > b[param]) {
          return order === 'asc' ? 1 : -1;
      }
      if (a[param] < b[param]) {
          return order === 'asc' ? -1 : 1;
      }
      return 0;
    })
    return newPlanetsArr
  }

  return (
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
              <div className="minPopulationGroup">
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
          <h3>Search:</h3>
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
  )
}

export default Filters