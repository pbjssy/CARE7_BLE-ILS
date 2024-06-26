import React, {useContext, useEffect, useState} from 'react'
import { NECNodeContext } from '../../pages/Team1B'
import DataTile1B from './DataTile1B';
import CareLoader from '../CareLoader';
import CompassNormal from '../../assets/team-1b/compass_normal.png';
import CompassInverted from '../../assets/team-1b/compass_inverted.png';

export default function DataTable1B() {
    let fields, units, parameters, values;
    const [timeStamp, setTimeStamp] = useState("");
    const [AQI, setAQI] = useState(0);
    const [getData, setGetData] = useState(false);
    const [WSPD, setWSPD] = useState(0);
    const [WGUST, setWGUST] = useState(0);
    const [WDIR, setWDIR] = useState(0);
    const [TMP, setTMP] = useState(0);
    const [RH, setRH] = useState(0);
    const [PM2p5, setPM2p5] = useState(0);
    const [PM10, setPM10] = useState(0);
    const [TVOC, setTVOC] = useState(0);
    const [CO2, setCO2] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeDifference, setTimeDifference] = useState(0);
    const [serverTime, setServerTime] = useState();

    const [isFetched, setIsFetched] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [promptMessage, setPromptMessage] = useState("Loading...");

    const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);

    if (nodeDetails.withWind == true) {
        fields = ["Wind Speed", "Wind Gust", "Wind Direction"];
        parameters = ["WSPD", "WGUST", "WDIR"]
        units = ["m/s", "m/s", ""];
        values = [WSPD, WGUST, WDIR];
    } else {
        fields = ["Temperature", "RH", "PM2.5", "PM10", "TVOC", "eCO2", "AQI"];
        parameters = ["TMP", "RH", "PM2p5", "PM10", "TVOC", "CO2", "AQI"];
        units = ["°C", "%", "ppm", "ppm", "ppb", "ppm", ""];
        values = [TMP, RH, PM2p5, PM10, TVOC, CO2, AQI];
    }

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        let hours = date.getUTCHours() + 8;
        let minutes = date.getUTCMinutes();
        let seconds = date.getUTCSeconds();

        if (hours >= 24) {
            hours -= 24;
            day = parseInt(day) + 1;
        }

        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    const getSensorData = async () => {
        const options = {method: 'GET', headers: {accept: 'application/json'}};
        const payload = await fetch(`https://sync.upcare.ph/api/measurement/EEE199_NEC/latest?source=${nodeDetails.node}`, options);
        const data = await payload.json();
        return data;
    }

    const dataTiles = fields.map((pollutant, index) => (
        <DataTile1B key={index} pollutant={pollutant} unit={units[index]} value={values[index]}/>
    ))

    const getTimeDifference = () => {
        try {
            let server = new Date(serverTime);
            server.setHours(server.getHours() + 8);
            let systemTime = new Date();
            systemTime.setHours(systemTime.getHours() + 8);
            let difference = (systemTime - server) / (1000 * 60);
            console.log(`system time: ${systemTime.toISOString()}`);
            console.log(`payload time: ${server.toISOString()}`);
            console.log(`time difference in minutes: ${difference}`);
            setTimeDifference(difference);
            if (difference > 5) {
                setIsActive(false);
            } else {
                setIsActive(true);
            }
        } catch (e) {
            console.log(e);
        }
    }

    setTimeout(() => {
        setGetData(!getData);
    },300000);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(nodeDetails.node) {
                    setIsFetched(false);
                    setShowLoader(false);
                    if(nodeDetails.withWind) {
                        setPromptMessage("Loading wind data");
                        setShowLoader(true);
                        await getSensorData()
                        .then(data => {
                            setWSPD(data[2].value);
                            setWGUST(data[1].value);
                            setWDIR(data[0].value);
                            setServerTime(data[0].local_time);
                            setTimeStamp(formatTime(data[0].local_time));
                            setIsFetched(true);
                            setShowLoader(false);
                        });
                    } else {
                        setPromptMessage("Loading sensor data");
                        setShowLoader(true);
                        await getSensorData()
                        .then(data => {
                            setTMP(data[6].value);
                            setRH(data[5].value);
                            setPM2p5(data[3].value);
                            setPM10(data[2].value);
                            setTVOC(data[7].value);
                            setCO2(data[1].value);
                            setAQI(data[0].value);
                            setTimeStamp(formatTime(data[0].local_time));
                            setServerTime(data[0].local_time);
                            setIsFetched(true);
                            setShowLoader(false);
                        });
                    }
                }
                
            } catch (e) {
                setShowLoader(false);
                setPromptMessage("Node data not found");
            }
        };
        fetchData();
    },[getData, nodeDetails])

    useEffect(() => {
        if (serverTime) {
            getTimeDifference();
        }
        
    }, [serverTime]);

    return (
        <div className="data-tiles-container-1b">
            <div className="sensor-data-info-1b">
                <h2>{nodeDetails.facility}</h2>
                <h3>Node #{nodeDetails.node} ({nodeDetails.type})</h3>
                <p>Time stamp: {isFetched ? timeStamp : promptMessage}</p>
                <p style={{backgroundColor: isFetched ? (isActive ? "#024E1B": "#ED2938") : null}}>Status: {isFetched ? (isActive ? "Active" : "Inactive") : "Loading"}</p>
                <a href="https://carespiceteam1b.grafana.net/public-dashboards/0f610ff40896414f8407213ddc658904" target="_blank" rel="noopener noreferrer" className='grafana-portal-1b'>
                    <p className='grafana-portal-text-1b'>Visit Grafana Dashboard</p>
                </a>
            </div>
            <div className={`data-tiles-collection-1b ${isFetched ? '' : 'loading-1b'}`}>
                {/* {isFetched ? dataTiles : <h3>{promptMessage}</h3>} */}
                {/* {showLoader ? <CareLoader /> : (isFetched ? dataTiles : <h3>{promptMessage}</h3>)} */}
                {showLoader ? <CareLoader /> : dataTiles}
            </div>
            {nodeDetails.withWind ? <img src={nodeDetails.facility == "Seminar Room" ? CompassNormal : CompassInverted} className='compass-1b'/> : <></>}
        </div>
    )
}
