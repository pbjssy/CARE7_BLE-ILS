import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import '../styles/team-1f/team1f.css';
import one from '../assets/team-1f/1.png';
import two from '../assets/team-1f/2.png';
import three from '../assets/team-1f/3.png';
import four from '../assets/team-1f/4.png';
import floorplan from '../assets/team-1f/floor-plan.png';
import applogo from '../assets/team-1f/wgb.png';
import pin from '../assets/team-1f/pin.png';
import time from '../assets/team-1f/time.png';
import anchor from '../assets/team-1f/anchor.png';
import history_logo from '../assets/team-1f/history.png';
import close_1 from '../assets/team-1f/close_1.png';
import close_2 from '../assets/team-1f/close_2.png';
import axios from 'axios';
import hdata from '../components/team-1f/1d.json';

const initialArray = [
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null]
];

const availableImages = { "0xA123": one, "0xB123": two, "0xC123": three, "0xD123": four };

const getColumnIndex = (x) => {
    if (x >= 10.5 && x < 11.25) return 0;
    else if (x >= 9.5 && x < 10.5) return 1;
    else if (x >= 8.5 && x < 9.5) return 2;
    else if (x >= 7.5 && x < 8.5) return 3;
    else if (x >= 6.5 && x < 7.5) return 4;
    else if (x >= 5.5 && x < 6.5) return 5;
    else if (x >= 4.5 && x < 5.5) return 6;
    else if (x >= 3.5 && x < 4.5) return 7;
    else if (x >= 2.5 && x < 3.5) return 8;
    else if (x >= 1.5 && x < 2.5) return 9;
    else if (x >= 0.5 && x < 1.5) return 10;
    else return -1;
};

const getRowIndex = (y) => {
    if (y >= 0.5 && y < 1.5) return 0;
    else if (y >= 1.5 && y < 2.5) return 1;
    else if (y >= 2.5 && y < 3.5) return 2;
    else if (y >= 3.5 && y < 4.5) return 3;
    else if (y >= 4.5 && y < 5.5) return 4;
    else return -1;
};

const sendSMS = async () => {
    try {
        const defaultMsg = "The individual has left the room.";
        console.log('Attempting to send SMS...');
        const response = await axios.post('http://localhost:5000/send-sms', {
            messageBody: defaultMsg
        });
        console.log('SMS Response:', response.data);
    } catch (err) {
        console.error('Error sending SMS:', err);
    }
};

const getSensorData = async (source) => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const response = await fetch(`https://sync.upcare.ph/api/measurement/ECE199_BLE_ILS/latest?topic=UPCARE%2FUNDERGRAD%2FBLE_ILS&source=${source}`, options);
        const data = await response.json();
        console.log("Bryan", data)

        if (!Array.isArray(data)) {
            throw new Error('Expected an array in the response');
        }

        console.log('Sensor Data for source', source, ':');
        
        // Group entries by local_time
        const groupedData = {};
        data.forEach(entry => {
            if (!groupedData[entry.local_time]) {
                groupedData[entry.local_time] = { x_location: null, y_location: null };
            }
            if (entry.type === 'x_location') {
                groupedData[entry.local_time].x_location = entry.value;
            } else if (entry.type === 'y_location') {
                groupedData[entry.local_time].y_location = entry.value;
            }
        });

        // Create pairs containing x_location and y_location values
        const result = [];
        Object.entries(groupedData).forEach(([local_time, { x_location, y_location }]) => {
            if (x_location !== null && y_location !== null) {
                const pair = {
                    source: source, // Added source field
                    local_time: local_time,
                    x_location: x_location,
                    y_location: y_location,
                    column: getColumnIndex(x_location),
                    row: getRowIndex(y_location)
                };
                result.push(pair);
            }
        });

        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error fetching sensor data:', error.message);
        return [];
    }
}

const processSensorData = async (source, setTwoDArray) => {
    try {
        const sensorData = await getSensorData(source);

        const newArray = Array.from({ length: 5 }, () => Array.from({ length: 11 }, () => null));

        console.log(`Processing sensor data for source: ${source}`); // Debugging log

        sensorData.forEach(({ column, row }) => {
            console.log(`Assigning image for column: ${column}, row: ${row}, source: ${source}`); // Debugging log
            if (row !== -1 && column !== -1) {
                newArray[row][column] = availableImages[source];
            }
            else{
                console.log("Column index is -1. Triggering sendSMS...");
                sendSMS(); // Trigger sendSMS when column is -1
            }
        });

        console.log('Updated 2D Array before setting state:', newArray); // Debugging log
        setTwoDArray(newArray);
    } catch (error) {
        console.error('Error processing sensor data:', error);
    }
};

const ArrayTable = ({ source }) => {
    const [twoDArray, setTwoDArray] = useState(initialArray);

    useEffect(() => {
        const interval = setInterval(() => processSensorData(source, setTwoDArray), 2000);
        return () => clearInterval(interval);
    }, [source]);

    useEffect(() => {
        console.log('Updated twoDArray:', twoDArray); // Debugging log
    }, [twoDArray]);

    return (
        <div id="result">
            <table style={{ width: '94.6%', height: '93%', marginTop: '4px' }} className='table'>
                <tbody>
                    {twoDArray.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((col, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid #cccccc', textAlign: 'center', verticalAlign: 'middle'  }} className='cell'>
                                    {col === null ? "___" : <img src={col} width="30" alt="pin" />}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const HistoricalData = ({ source }) => {
    const [sensorData, setSensorData] = useState([]);
    const [initialTimestamp, setInitialTimestamp] = useState('');
    const [finalTimestamp, setFinalTimestamp] = useState('');
    const [currentTimestamp, setCurrentTimestamp] = useState(''); // State for the current timestamp
    const canvasRef = useRef(null);
    const tableRef = useRef(null);
    const imageRef = useRef(null); // Ref for the moving image

    const getImageBySource = (source) => {
        switch (source) {
            case '0xA123':
                return one;
            case '0xB123':
                return two;
            case '0xD123':
                return four;
            default:
                return null;
        }
    };

    const getColumnIndex = (x) => {
        if (x >= 10.5 && x < 11.25) return 0;
        else if (x >= 9.5 && x < 10.5) return 1;
        else if (x >= 8.5 && x < 9.5) return 2;
        else if (x >= 7.5 && x < 8.5) return 3;
        else if (x >= 6.5 && x < 7.5) return 4;
        else if (x >= 5.5 && x < 6.5) return 5;
        else if (x >= 4.5 && x < 5.5) return 6;
        else if (x >= 3.5 && x < 4.5) return 7;
        else if (x >= 2.5 && x < 3.5) return 8;
        else if (x >= 1.5 && x < 2.5) return 9;
        else if (x >= 0.5 && x < 1.5) return 10;
        else return -1;
    };

    const getRowIndex = (y) => {
        if (y >= 0.5 && y < 1.5) return 0;
        else if (y >= 1.5 && y < 2.5) return 1;
        else if (y >= 2.5 && y < 3.5) return 2;
        else if (y >= 3.5 && y < 4.5) return 3;
        else if (y >= 4.5 && y < 5.5) return 4;
        else return -1;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Invalid timestamp';

        const localTime = new Date(timestamp);
        const hours = localTime.getHours().toString().padStart(2, '0');
        const minutes = localTime.getMinutes().toString().padStart(2, '0');
        const seconds = localTime.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    };

    const getSensorData = async (source) => {
        try {
            const filteredData = hdata.filter(item => item.source === source);
            const groupedData = {};
            filteredData.forEach(entry => {
                const { local_time, x_location, y_location } = entry;
                if (!groupedData[local_time]) {
                    groupedData[local_time] = { x_location: null, y_location: null };
                }
                if (x_location !== undefined) {
                    groupedData[local_time].x_location = x_location;
                }
                if (y_location !== undefined) {
                    groupedData[local_time].y_location = y_location;
                }
            });

            const timestamps = Object.keys(groupedData).map(timestamp => new Date(`${timestamp}Z`));
            if (timestamps.length > 0) {
                const initialTimestamp = timestamps.reduce((min, current) => current < min ? current : min);
                const finalTimestamp = timestamps.reduce((max, current) => current > max ? current : max);
                setInitialTimestamp(formatTimestamp(initialTimestamp));
                setFinalTimestamp(formatTimestamp(finalTimestamp));
            }

            const result = [];
            Object.entries(groupedData).forEach(([local_time, { x_location, y_location }]) => {
                if (x_location !== null && y_location !== null) {
                    const pair = {
                        source: source,
                        local_time: local_time,
                        x_location: x_location,
                        y_location: y_location,
                        column: getColumnIndex(x_location),
                        row: getRowIndex(y_location)
                    };
                    result.push(pair);
                }
            });

            return result.sort((a, b) => new Date(a.local_time) - new Date(b.local_time)); // Sort data by local_time
        } catch (error) {
            console.error('Error fetching sensor data:', error.message);
            return [];
        }
    };

    useEffect(() => {
        const drawPathToLatestData = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (sensorData.length === 0) return;

            const table = tableRef.current;
            const cellWidth = table.offsetWidth / 11;
            const cellHeight = table.offsetHeight / 5;

            const points = [];
            const endIndex = Math.min(30, sensorData.length); // Ensure endIndex does not exceed array length

            for (let i = 0; i < endIndex; i++) {
                const { x_location, y_location, source, local_time } = sensorData[i];
                const column = getColumnIndex(x_location);
                const row = getRowIndex(y_location);
                if (column !== -1 && row !== -1) {
                    const x = column * cellWidth + cellWidth / 2;
                    const y = row * cellHeight + cellHeight / 2;
                    points.push({ x, y, source, local_time });
                }
            }

            if (points.length > 1) {
                // Create gradient based on start and end points
                const startX = points[0].x;
                const startY = points[0].y;
                const endX = points[points.length - 1].x;
                const endY = points[points.length - 1].y;

                let gradient;
                if (source === "0xA123") {
                    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                    gradient.addColorStop(0, '#d3f1fd');
                    gradient.addColorStop(1, '#0091CE');
                    ctx.strokeStyle = gradient;
                }
                else if (source === "0xB123") {
                    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                    gradient.addColorStop(0, '#e7d8f8');
                    gradient.addColorStop(1, '#7F39D0');
                    ctx.strokeStyle = gradient;
                }
                else if (source === "0xD123") {
                    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                    gradient.addColorStop(0, '#d0fad0');
                    gradient.addColorStop(1, '#19AD18');
                    ctx.strokeStyle = gradient;
                }

                ctx.lineWidth = 7;
                ctx.lineCap = 'round'; // Sets the line cap style to round
                ctx.lineJoin = 'round'; // Sets the line join style to round
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();

                let currentIndex = 0;
                const img = new Image();
                img.src = getImageBySource(sensorData[0].source); // Using the image of the first source to trace the path
                img.onload = () => {
                    const animate = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before each draw
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 7;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (let i = 1; i <= currentIndex; i++) {
                            ctx.lineTo(points[i].x, points[i].y);
                        }
                        ctx.stroke();

                        // Draw the image at the current position
                        const { x, y, local_time } = points[currentIndex];
                        ctx.drawImage(img, x - 12.5, y - 12.5, 25, 25); // Adjusting the position to center the image
                        
                        // Update the current timestamp
                        setCurrentTimestamp(formatTimestamp(local_time));

                        // Update the index and check if animation should continue
                        if (currentIndex < points.length - 1) {
                            currentIndex++;
                            setTimeout(animate, 2000); // Move to the next point every 2 seconds
                        }
                    };
                    animate();
                };
            }
        };

        // Initial drawing
        drawPathToLatestData();

    }, [sensorData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSensorData(source);
                // Sort data by local_time
                data.sort((a, b) => new Date(a.local_time) - new Date(b.local_time));
                // Update sensor data state
                setSensorData(data);
                // Update timestamps
                setInitialTimestamp(formatTimestamp(new Date(data[0].local_time)));
                setFinalTimestamp(formatTimestamp(new Date(data[data.length - 1].local_time)));
            } catch (error) {
                console.error('Error fetching sensor data:', error.message);
            }
        };
        fetchData();
    }, [source]);

    return (
        <div id="result">
            <canvas ref={canvasRef} width={tableRef.current ? tableRef.current.offsetWidth : 935} height={tableRef.current ? tableRef.current.offsetHeight : 255} style={{ position: 'absolute', top: '123px', left: '30px', pointerEvents: 'none' }} />
            <table ref={tableRef} style={{ width: '85.5%', height: '51%', marginTop: '123px', marginLeft: '30px' }} className='table'>
                <tbody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: 11 }).map((_, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} style={{ textAlign: 'center', verticalAlign: 'middle', position: 'relative' }} className='cell-history'>
                                    ___
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '40px', textAlign: "center" }}>
                <p className='timestamp'><b>Current Timestamp: </b>{currentTimestamp}</p> {/* Display current timestamp */}
                <p className='timestamp'><b>Initial Timestamp: </b>{initialTimestamp}</p>
                <p className='timestamp'><b>Final Timestamp: </b>{finalTimestamp}</p>
            </div>
        </div>
    );
};







function Team1F() {
    const [dateTime, setDateTime] = useState(new Date());
    const [clicked, setClicked] = useState(false); // Add clicked state
    const [hoveredText, setHoveredText] = useState('');
    const [hoveredDivStyles, setHoveredDivStyles] = useState({});
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleMouseOver = (e) => {
        const text = e.target.getAttribute('data-text');
        const styles = {
            position: 'absolute',
            top: '540px',
            left: '1133px',
            backgroundColor: 'rgba(97, 97, 97, 0.8)',
            fontFamily: "arial system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            padding: '5px',
            color: '#fff',
            borderRadius: '7px',
            marginLeft: getMarginLeft(text)
        };
        setHoveredText(text);
        setHoveredDivStyles(styles);
    };

    const handleMouseOut = () => {
        setHoveredText('');
        setHoveredDivStyles({});
    };

    const getMarginLeft = (text) => {
        switch (text) {
            case 'BLE 5':
                return '10px';
            case 'BLE 5.':
                return '110px';
            case 'MCU':
                return '215px';
            default:
                return '0';
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        setActiveBeacons([true, false, false, false]);
    };

    const [activeBeacons, setActiveBeacons] = useState([false, false, false, false]);

    // Handle click for a specific beacon
    const handleClick = (index) => {
        // Create a new array to hold the updated state of all beacons
        const updatedBeacons = activeBeacons.map((beacon, idx) => idx === index);
    
        // Update the state with the new array
        setActiveBeacons(updatedBeacons);
    };

    return (
        <div>
            <NavBar />
            <div className='history' onClick={toggleModal}>
                <img src={history_logo} width="18px" />
                <p id='history-text'>History</p>
            </div>
            {showModal && (
                <div className="modal-background">
                    <div className="modal">
                        <div className='exit'>
                            <img src={close_1} onClick={toggleModal} className='close_1' />
                            <img src={close_2} onClick={toggleModal} className='close_2' />
                        </div>
                        <div className='tab-bar'>
                            <img src={applogo} width="130px" style={{marginLeft: "40px", marginTop: "15px", marginBottom: "10px"}} alt="app-logo" />
                            <a href='#map_b1' style={{textDecoration: "none", color:"black", backgroundColor: activeBeacons[0] ? "rgb(222, 222, 222)" : "white"}}>
                                <div className='beacon' onClick={() => handleClick(0)} style={{backgroundColor: activeBeacons[0] ? "rgb(222, 222, 222)" : "white"}}>
                                    <img src={one} width="40px" style={{marginLeft: "38px"}} />
                                    <p className={activeBeacons[0] ? 'bold' : ''}>0xA123</p>
                                </div>
                            </a>
                            <a href='#map_b2' style={{textDecoration: "none", color:"black", backgroundColor: activeBeacons[1] ? "rgb(222, 222, 222)" : "white"}}>
                                <div className='beacon' onClick={() => handleClick(1)} style={{backgroundColor: activeBeacons[1] ? "rgb(222, 222, 222)" : "white"}}>
                                    <img src={two} width="40px" style={{marginLeft: "38px"}} />
                                    <p className={activeBeacons[1] ? 'bold' : ''}>0xB123</p>
                                </div>
                            </a>
                            <a href='#map_b4' style={{textDecoration: "none", color:"black", backgroundColor: activeBeacons[3] ? "rgb(222, 222, 222)" : "white"}}>
                                <div className='beacon' onClick={() => handleClick(3)} style={{backgroundColor: activeBeacons[3] ? "rgb(222, 222, 222)" : "white"}}>
                                    <img src={four} width="40px" style={{marginLeft: "38px"}} />
                                    <p className={activeBeacons[3] ? 'bold' : ''}>0xD123</p>
                                </div>
                            </a>
                        </div>
                        <div id="map_b1" style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "23px", position: "absolute", marginLeft: "200px", marginTop:"-528px"}}></div>
                        <div className="map_b1" style={{position: "relative"}}>
                            <p style={{fontSize: "18px", textAlign: "center", marginTop: "30px"}}>Last seven recorded points for beacon <b>0xA123</b>.</p>                            
                            <img src={floorplan} width="90%" style={{boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft: "35px", marginTop: "70px"}} alt="floor-plan" />
                            <HistoricalData source="0xA123" />
                        </div>
                        <div id="map_b2" style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "32px", position: "absolute", marginLeft: "200px", marginTop: "550px"}}></div>
                        <div className="map_b2">
                            <p style={{fontSize: "18px", textAlign: "center", marginTop: "30px"}}>Last seven recorded points for beacon <b>0xB123</b>.</p>
                            <img src={floorplan} width="90%" style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft:"35px", marginTop:"70px" }} alt="floor-plan" />
                            <HistoricalData source="0xB123" />
                        </div>
                        <div id="map_b4" style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "40px", position: "absolute", marginLeft: "200px", marginTop: "2680px"}}></div>
                        <div className="map_b4">
                            <p style={{fontSize: "18px", textAlign: "center", marginTop: "30px"}}>Last seven recorded points for beacon <b>0xC123</b>.</p>
                            <img src={floorplan} width="90%" style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft:"35px", marginTop:"70px" }} alt="floor-plan" />
                            <HistoricalData source="0xD123" />
                        </div>
                        <div style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "30px", position: "absolute", marginLeft: "200px", marginTop: "3750px"}}></div>
                    </div>
                </div>
            )}
            <div className="map">
                <img src={floorplan} width="830px" style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px' }} alt="floor-plan" />
                <ArrayTable source="0xA123" />
                <ArrayTable source="0xB123" />
                <ArrayTable source="0xD123" />
            </div>
            <div className="desc">
                <p><b>WanderGuard BLE</b> is a web app that uses Nordic nRF52840 BLE anchors to display real-time location on a room with beacons represented by the three round pins. Ideal for healthcare and security, it ensures seamless monitoring through an intuitive interface.</p>
            </div>
            <div className="app-logo">
                <img src={applogo} width="300px" alt="app-logo" />
            </div>
            <p id="title-text-1f"><b> DATA VISUALIZATION – BLE ILS </b></p>
            <div className="info">
                <img id="pin-logo" src={pin} width="30px" alt="pin-logo" />
                <p><b>LOCATION:</b> Room 320, Electrical and Electronics Engineering Institute, UP Diliman</p>
                <img id="time-logo" src={time} width="30px" alt="time-logo" />
                <p style={{ marginTop: '17px' }}><b>LAST UPDATED:</b> <span id="timestamp">{dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}</span></p>
            </div>
            <div className="legend" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <p id="legend-text"><b>LEGEND:</b></p>
                <img id="anchor-logo" src={anchor} width="30px" />
                <p style={{ marginLeft: '14px' }}>anchor</p>

                <img id="one" src={one} width="30px" data-text="BLE 5" />
                <p style={{ marginLeft: '37px' }}>0xA123</p>

                <img id="two" src={two} width="30px" data-text="BLE 5." />
                <p style={{ marginLeft: '40px' }}>0xB123</p>

                <img id="four" src={four} width="30px" data-text="MCU" />
                <p style={{ marginLeft: '39px' }}>0xD123</p>
            </div>
            {hoveredText && (
                <div style={{ ...hoveredDivStyles }}>
                    {hoveredText}
                </div>
            )}
        </div>
    );
}

export default Team1F;
