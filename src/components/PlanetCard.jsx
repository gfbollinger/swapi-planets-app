import React from 'react'

const PlanetCard = ({planet, sortSelection}) => {
  return (
    <li className='planetCard'>
      <h3 className={sortSelection === 'name' ? 'highlight planetName' : 'planetName'}>{planet.name}</h3>
      <div className="planetImage-wrapper">
        <div className={`planetImage planetImage-${planet.planet_size}`}>{planet.planet_size}</div>
      </div>
      <div><strong>Climate:</strong> {planet.climate}</div>
      <div><strong>Terrain:</strong> {planet.terrain}</div>

      <hr />

      <ul className='planetDataList'>
        <li className={ sortSelection === 'population' ? 'highlight' : ''}>
          Population: 
          &nbsp;<strong>{planet.population === -1 ? 'unknown' : planet.population.toLocaleString('en-US')}</strong>
        </li>
        <li className={ sortSelection === 'diameter' ? 'highlight' : ''}>
          Diameter:
          &nbsp;<strong>{ planet.diameter === -1 ? 'unknown' : planet.diameter.toLocaleString('en-US')}</strong>
        </li>
        <li>Rotation Period: <strong>{planet.rotation_period}</strong></li>
        <li>Orbital Period: <strong>{planet.orbital_period}</strong></li>
      </ul>
    </li>
  )
}

export default PlanetCard