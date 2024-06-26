import React, { createContext, useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import FloorSelect1B from '../components/team-1b/FloorSelect1B';
import FloorPlanContainer1B from '../components/team-1b/FloorPlanContainer1B';
import Modal1B from '../components/team-1b/Modal1B';
import DataTable1B from '../components/team-1b/DataTable1B';

export const NECFloorContext = createContext();
export const NECNodeContext = createContext();
export const ScreenSizeContext = createContext();

export default function Team1B() {
    const [floor, setFloor] = useState(0);
    const [openModal, setOpenModal] = useState(false)
    const [screenWidth, setScreenWidth] = useState(window.screenWidth);
    const [location, setLocation] = useState({
        facility: "Audio Visual Room",
        room: "Main Room"
    })
    const [nodeDetails, setNodeDetails] = useState({
        node: 1,
        facility: "Audio Visual Room",
        type: "Indoor",
        withWind: false
    })
    useEffect(() => {
        setScreenWidth(window.innerWidth);
        const changeWidth = () => {
          setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', changeWidth)
      })
    return (
    <ScreenSizeContext.Provider value={[screenWidth, setScreenWidth]}>
        <NECNodeContext.Provider value={[nodeDetails,setNodeDetails]}>
            <NECFloorContext.Provider value={{floor, setFloor, location, setLocation, openModal, setOpenModal}}>
                {openModal ? <Modal1B /> : <></>}
                <NavBar />
                <div className="app-container-1b">
                    <FloorSelect1B />
                    <div className="main-container-1b">
                        <FloorPlanContainer1B FloorCode = {floor}/>
                        <DataTable1B />
                    </div>
                </div>
            </NECFloorContext.Provider>
        </NECNodeContext.Provider>
    </ScreenSizeContext.Provider>

    )
}
