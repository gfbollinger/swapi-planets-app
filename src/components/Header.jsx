import React from 'react'
import logo from './../assets/images/star-wars-logo.svg'

const Header = () => {
  return (
    <div className='header'>
      <img src={logo} alt="Star Wars logo" className='mainLogo' width={200} />
      <h1>Planets Encyclopedia</h1>
    </div>
  )
}

export default Header