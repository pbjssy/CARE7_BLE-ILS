import React, {useState, useEffect} from 'react';
import carelogo from '../assets/upcare.webp'
import '../styles/navbar.css'

const NavBar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.screenWidth);
  const [animationClass, setAnimationClass] = useState("");

  const burgerToggle = () => {
    setToggleMenu(!toggleMenu);
  }

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', changeWidth)
  })

  return (
    <div className="nav-bar">
      <div className="care-logo-container">
        <a href="https://upcare.ph/" target="_blank"><img src={carelogo} alt="UP CARE Logo" className='care-logo'/></a>
        <div className='toggle-button' onClick={burgerToggle}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      {(toggleMenu || screenWidth > 800) && (
        <div className={`links ${animationClass}`}>
          <a href="/home" className="link-text">Home</a>
          <div className="navbar-dropdown">
              <a href="#" className="navbar-dropdown-text">Projects<span className="arrow">&gt;</span></a>
              <div className="navbar-projects-dropdown">
                  <a href="/ble-project" className="project-link">BLE Project</a>
                  <a href="/nec-project" className="project-link">NEC Project</a>
                  <a href="/" className="project-link">PGH Project</a>
                  <a href="/pub-project" className="project-link">PUB Project</a>
              </div>
          </div>
          <a href="#" className="link-text"> Contributors </a>
          <a href="#" className="link-text"> Contact Us </a>
        </div>
      )}

    </div>
  );
}

export default NavBar;
