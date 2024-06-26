import React, {useContext} from 'react'
// import { NECNodeContext } from '../../pages/Team1B'
import DataTile1H from './DataTile1H';
export default function DataTable1H() {
    let fields;
    // let units;
    let values;
    // const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
    fields = ["Overall", "CO2", "CO", "NO2", "PM2.5", "PM10", "VOCs"];
        // units = ["°C", "%", "ppm", "ppm", "ppb", "ppm", "m/s", ""];
    values = [150, 150, 129, 76, 63, 32, 54];
    // else {
    //     fields = ["Temperature", "RH", "PM2.5", "PM10", "TVOC", "eCO2"];
    //     // units = ["°C", "%", "ppm", "ppm", "ppb", "ppm"];
    //     values = [25.27, 54.11, 7.9, 7.9, 13, 407];
    // }
    const dataTiles = fields.map((pollutant, index) => (
        <DataTile1H key={index} pollutant={pollutant} value={values[index]}/>
    ))
    return (
        <div className="tile-container-1h">
            <h2>Air Quality Index</h2>
            {dataTiles}
        </div>
    )
}
