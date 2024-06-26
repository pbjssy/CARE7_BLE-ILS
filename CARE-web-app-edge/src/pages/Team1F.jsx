import React, { useState, useEffect } from 'react';
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

const initialArray = [
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null]
];

const initialArray1 = [
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null]
];

const availableImages = { "0xA123": one, "0xB123": two, "0xC123": three, "0xD123": four };

const getColumnIndex = (x) => {
    if (x >= 10.5 && x < 11) return 0;
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
        const response = await axios.post('http://localhost:8080/send-sms', {
            messageBody: defaultMsg
        });
        console.log('SMS Response:', response.data);
    } catch (err) {
        console.error('Error sending SMS:', err);
    }
};

const fetchDataEverySecond = (source) => {
    // Define the function to fetch data
    const fetchData = async () => {
        const options = { method: 'GET', headers: { accept: 'application/json' } };

        try {
            const response = await fetch(`http://localhost:5000/sensor-data?source=${source}`, options);
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Expected an array in the response');
            }

            console.log('Sensor Data for source', source, ':', data);

            const result = [];
            data.forEach(({ local_time, source, x_location, y_location }) => {
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

            console.log('Result:', result);
            // You can do something with the result here

        } catch (error) {
            console.error('Error fetching sensor data:', error.message);
        }
    };

    // Fetch data initially and then at 1-second intervals
    fetchData(); // Fetch data initially
    setInterval(fetchData, 1000); // Fetch data every 1 second
};


const getSensorData = async (source) => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const response = await fetch(`http://localhost:5000/sensor-data?source=${source}`, options);
        const data = await response.json();
        console.log("data123", data)

        if (!Array.isArray(data)) {
            throw new Error('Expected an array in the response');
        }

        console.log('Sensor Data for source', source, ':');

        /*
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
        */

        // Create pairs containing x_location and y_location values
        const result = [];
        //Object.entries(groupedData).forEach(([local_time, { x_location, y_location }]) => {
        Object.entries(data).forEach(([index, { local_time, source, x_location, y_location }]) => {
            if (x_location !== null && y_location !== null) {
                const pair = {
                    source: source, // Added source field
                    local_time: local_time,
                    x_location: x_location,
                    y_location: y_location,
                    column: getColumnIndex(x_location),
                    row: getRowIndex(y_location)
                };
                console.log("PAIR", pair)
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

        //setTwoDArray(newArray);
        console.log(`Processing sensor data for source: ${source}`); // Debugging log

        //setTwoDArray(foreverInitialArray);
        console.log("SENSOR DATA AKO", sensorData)
        sensorData.forEach(({source, column, row }) => {
            
            console.log(`Assigning image for column: ${column}, row: ${row}, source: ${source}`); // Debugging log
            if (row !== -1 && column !== -1) {
                newArray[row][column] = availableImages[source];
            }
            else {
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
        //setTwoDArray(initialArray1)
        const interval = setInterval(() => processSensorData(source, setTwoDArray), 1000);
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
                                <td key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid #cccccc', textAlign: 'center', verticalAlign: 'middle', position: 'relative' }} className='cell'>
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
                return '0px';
            case 'BLE 5.':
                return '65px';
            case 'BLE 3':
                return '132px';
            case 'MCU':
                return '200px';
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
                            <a href='#map_b3' style={{textDecoration: "none", color:"black", backgroundColor: activeBeacons[2] ? "rgb(222, 222, 222)" : "white"}}>
                                <div className='beacon' onClick={() => handleClick(2)} style={{backgroundColor: activeBeacons[2] ? "rgb(222, 222, 222)" : "white"}}>
                                    <img src={three} width="40px" style={{marginLeft: "38px"}} />
                                    <p className={activeBeacons[2] ? 'bold' : ''}>0xC123</p>
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
                            <p style={{fontSize: "18px", marginLeft: "200px", marginTop: "30px"}}>Recorded path from the last n minutes.</p>
                            <canvas id="lineCanvas" width="534px" height="240px" style={{position: 'absolute', top: '100px', left: '60px', border: "1px solid black"}}></canvas>
                            <img src={floorplan} width="85%" style={{boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft: "50px", marginTop: "40px"}} alt="floor-plan" />
                        </div>


                        <div id="map_b2" style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "32px", position: "absolute", marginLeft: "200px", marginTop: "550px"}}></div>
                        <div className="map_b2">
                            <img src={floorplan} width="85%" style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft:"50px", marginTop:"50px" }} alt="floor-plan" />
                        </div>
                        <div id="map_b3" style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "32px", position: "absolute", marginLeft: "200px", marginTop: "1610px"}}></div>
                        <div className="map_b3">
                            <img src={floorplan} width="85%" style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft:"50px", marginTop:"50px" }} alt="floor-plan" />
                        </div>
                        <div id="map_b4" style={{width: "690px", backgroundColor: "rgb(239, 239, 239)", height: "40px", position: "absolute", marginLeft: "200px", marginTop: "2680px"}}></div>
                        <div className="map_b4">
                            <img src={floorplan} width="85%" style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px', marginLeft:"50px", marginTop:"50px" }} alt="floor-plan" />
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
                <p><b>WanderGuard BLE</b> is a web app that uses Nordic nRF52840 BLE anchors to display real-time location on a room map with beacons represented by the four round pins. Ideal for healthcare and security, it ensures seamless monitoring through an intuitive interface.</p>
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
