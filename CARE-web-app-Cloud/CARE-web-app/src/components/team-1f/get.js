const getColumnIndex = (x) => {
    if (x >= 0.5 && x < 1.5) return 0;
    else if (x >= 1.5 && x < 2.5) return 1;
    else if (x >= 2.5 && x < 3.5) return 2;
    else if (x >= 3.5 && x < 4.5) return 3;
    else if (x >= 4.5 && x < 5.5) return 4;
    else if (x >= 5.5 && x < 6.5) return 5;
    else if (x >= 6.5 && x < 7.5) return 6;
    else if (x >= 7.5 && x < 8.5) return 7;
    else if (x >= 8.5 && x < 9.5) return 8;
    else if (x >= 9.5 && x < 10.5) return 9;
    else if (x >= 10.5 && x < 11.5) return 10;
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

const getSensorData = async (source) => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const response = await fetch(`https://sync.upcare.ph/api/measurement/ECE199_BLE_ILS/latest?topic=UPCARE%2FUNDERGRAD%2FBLE_ILS&source=${source}`, options);
        const data = await response.json();

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
    } catch (error) {
        console.error('Error fetching sensor data:', error.message);
        return [];
    }
}

getSensorData("0xA123");
getSensorData("0xB123");
getSensorData("0xD123");