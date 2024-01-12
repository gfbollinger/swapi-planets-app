import React from 'react'

const PlanetCard = ({planet}) => {
  return (
    <li className='planetCard'>
      <h3>{planet.name}</h3>
      <div><strong>Climate:</strong> {planet.climate}</div>
      <div><strong>Terrain:</strong> {planet.terrain}</div>

      <hr />

      <ul className='planetDataList'>
        <li>Population: {parseInt(planet.population, 10).toLocaleString('en-US')}</li>
        <li>Diameter: {parseInt(planet.diameter, 10).toLocaleString('en-US')}</li>
        <li>Rotation Period: {planet.rotation_period}</li>
        <li>Orbital Period: {planet.orbital_period}</li>
      </ul>
    </li>
  )
}

export default PlanetCard