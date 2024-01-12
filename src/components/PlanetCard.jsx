import React from 'react'

const PlanetCard = ({planet}) => {
  return (
    <li className='planetCard'>
      <h3>{planet.name}</h3>
      <div><strong>Climate:</strong> {planet.climate}</div>
      <div><strong>Terrain:</strong> {planet.terrain}</div>

      <hr />

      <ul className='planetDataList'>
        <li>Population: {planet.population === -1 ? 'unknown' : planet.population.toLocaleString('en-US')}</li>
        <li>Diameter: { planet.diameter === -1 ? 'unknown' : planet.diameter.toLocaleString('en-US')}</li>
        <li>Rotation Period: {planet.rotation_period}</li>
        <li>Orbital Period: {planet.orbital_period}</li>
      </ul>
    </li>
  )
}

export default PlanetCard