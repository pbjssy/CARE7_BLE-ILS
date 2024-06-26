import React from 'react'
import NavBar from '../components/NavBar'
import '../styles/navbar.css'

const Home = () => {
    return (
        <div className="homepage">
            <NavBar />
            <div className="homepage-content">
                <div className="title">
                    <div className="title-animation">
                        <p className="title-text">EXPLORING ENVIRONMENTS: WHERE INDOOR AND OUTDOOR RESEARCH MEETS</p>
                        <p className="title-description">Students affiliated with the UP Center for Air Research in Urban Environments (CARE) provide a platform that serves as a a repository of their theses on indoor and outdoor environments, offering valuable data and insights for various purposes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;