import React, { createContext, useState } from 'react'
import NavBar from '../components/NavBar'
import MapSelect1H from '../components/team-1h/MapSelect1H'
import DataTable1H from '../components/team-1h/DataTable1H'
import StatusTile1H from '../components/team-1h/StatusTile1H'
import EnvironmentContainer1H from '../components/team-1h/EnvironmentContainer1H'
// import Indoor1H from '../components/team-1h/Environment/Indoor1H'

export const PUBMapContext = createContext();

export default function Team1H() {
    const [env, setEnv] = useState(0);
    return (
        <PUBMapContext.Provider value={{env, setEnv}}>
            <NavBar />
            <h1 id="web-title-1h">Public Utility Bus Air Quality Monitoring System</h1>
            <div className="main-container-1h">
                <div className="heatmap-container-1h">
                    <MapSelect1H />
                    <EnvironmentContainer1H Env = {env}/>
                </div>
                <div className="status-container-1h">
                    <StatusTile1H />
                </div>
                <div className="table-container-1h">
                    <DataTable1H />
                </div>
            </div>
        </PUBMapContext.Provider>
    )
}