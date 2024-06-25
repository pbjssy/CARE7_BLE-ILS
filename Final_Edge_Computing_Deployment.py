from flask import Flask, jsonify, make_response, request
import time
from flask_cors import CORS
import pandas as pd
import joblib
import asyncio
from bleak import BleakScanner, BleakClient 


def predict_location(classifier, RSSI_1, RSSI_3, RSSI_4, RSSI_5, TxPowerLevel):
    predict_sample = pd.DataFrame({'RSS_1': RSSI_1, 'RSS_3': RSSI_3, 'RSS_4': RSSI_4, 'RSS_5': RSSI_5, 'TxPower': TxPowerLevel}, index=[0])
    return classifier.predict(predict_sample)

def print_function (arr_1):
    for i in arr_1:
        print(i, end=', ')
    print()

def generate_sensor_data_payload(uuid, x_location, y_location):
    date_time = time.strftime("%Y-%m-%dT%H:%M:%S")
    payload = {
        "local_time": date_time,
        "source": uuid,
        "x_location": x_location,
        "y_location": y_location,
    }

    return payload

async def scan_devices():
    devices = await BleakScanner.discover(timeout=1, return_adv=True)
    for device, adv_data in devices.values():
        service_uuids = adv_data.service_uuids
        if service_uuids == ['53ecfb05-f0fa-4bac-8bb3-75dc3fdb7de1']:
            parse_manufacture_data(adv_data.manufacturer_data, 0, first_beacon, second_beacon, third_beacon, fourth_beacon)
        elif (service_uuids == ['a6068d7c-8e4e-4b9f-9309-512c5e5bccd3']):
            parse_manufacture_data(adv_data.manufacturer_data, 1, first_beacon, second_beacon, third_beacon, fourth_beacon)
        elif (service_uuids == ['1ca79355-bd0b-4748-9ff5-f5092e7eba9c']):
            parse_manufacture_data(adv_data.manufacturer_data, 2, first_beacon, second_beacon, third_beacon, fourth_beacon)
        elif (service_uuids == ['f0f6776f-44b6-414e-89de-b82d4b9d031c']):
            parse_manufacture_data(adv_data.manufacturer_data, 3, first_beacon, second_beacon, third_beacon, fourth_beacon)
        elif (service_uuids == ['2389ba13-3039-4dff-aa6c-5189ff96d0d7']):
            parse_manufacture_data(adv_data.manufacturer_data, 4, first_beacon, second_beacon, third_beacon, fourth_beacon)
        elif (service_uuids == ['1d4a883a-712b-497a-be68-844c30ec59db']):
            parse_manufacture_data(adv_data.manufacturer_data, 5, first_beacon, second_beacon, third_beacon, fourth_beacon)
    return 0


#List of Beacons UUID
#[RSSI_a, RSSI_b, RSSI_c, RSSI_d, RSSI_e, TxPower, UUID of Phone ]
#first_beacon = [69, 72, 80, 79, 82, 80, -6, hex(0xA123)]
first_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xA123)]
second_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xB123)]  
third_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xC123)]
fourth_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xD123)]

#convert 8bit value to its signed integer 
def to_signed_int(value):
    if value & (1 << 7):
        return -(256 - value)
    else:
        return value

#Parsing Function
def parse_manufacture_data(manufacturer_data, rssi_index, first_beacon, second_beacon, third_beacon, fourth_beacon):
    for key, value in manufacturer_data.items():
        first_beacon_rssi = key >> 8 & 0xFF 
        first_beacon_txpower = to_signed_int(key & 0xFF)
        second_beacon_txpower = to_signed_int(value[0]) 
        second_beacon_rssi = value[1] 
        third_beacon_txpower = to_signed_int(value[2])
        third_beacon_rssi = value[3]
        fourth_beacon_txpower = to_signed_int(value[4])
        fourth_beacon_rssi = value[5]
    
    first_beacon[6] = first_beacon_txpower
    second_beacon[6] = second_beacon_txpower
    third_beacon[6] = third_beacon_txpower
    fourth_beacon[6] = fourth_beacon_txpower

    first_beacon[rssi_index] = first_beacon_rssi
    second_beacon[rssi_index] = second_beacon_rssi
    third_beacon[rssi_index] = third_beacon_rssi
    fourth_beacon[rssi_index] = fourth_beacon_rssi
    return 0 

model_1 = joblib.load('x_random_forest_model_4anc.pkl')
model_2 = joblib.load('y_random_forest_model_4anc.pkl')


"""APPLICATION :DD"""
app = Flask(__name__)
CORS(app)

@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    #scan and update RSSI 
    asyncio.run(scan_devices())

    #predict
    first_location_x = predict_location(model_1, first_beacon[0], first_beacon[2], first_beacon[3], first_beacon[4], first_beacon[6])
    first_location_y = predict_location(model_2, first_beacon[0], first_beacon[2], first_beacon[3], first_beacon[4], first_beacon[6])
    second_location_x = predict_location(model_1, second_beacon[0], second_beacon[2], second_beacon[3], second_beacon[4], second_beacon[6])
    second_location_y = predict_location(model_2, second_beacon[0], second_beacon[2], second_beacon[3], second_beacon[4], second_beacon[6])
    fourth_location_x = predict_location(model_1, fourth_beacon[0], fourth_beacon[2], fourth_beacon[3], fourth_beacon[4], fourth_beacon[6])
    fourth_location_y = predict_location(model_2, fourth_beacon[0], fourth_beacon[2], fourth_beacon[3], fourth_beacon[4], fourth_beacon[6])
    
    
    # Generate payload with dynamic values
    print(first_location_x[0])
    print(first_location_y[0])

    """# Generate sensor data payload
    sensor_data = [
        generate_sensor_data_payload("0xA123", first_location_x[0], first_location_y[0]),
        generate_sensor_data_payload("0xB123", second_location_x[0], second_location_y[0]),
        #generate_sensor_data_payload("0xC123", third_location_x[0], third_location_y[0]),
        generate_sensor_data_payload("0xD123", fourth_location_x[0], fourth_location_y[0]),
    ]
    return jsonify(sensor_data)

    """
   
    # Generate sensor data payload based on source parameter
    source = request.args.get('source')
    if source == '0xA123':
        sensor_data = [generate_sensor_data_payload("0xA123", first_location_x[0], first_location_y[0])]
    elif source == '0xB123':
        sensor_data = [generate_sensor_data_payload("0xB123", second_location_x[0], second_location_y[0])]
    elif source == '0xD123':
        sensor_data = [generate_sensor_data_payload("0xD123", fourth_location_x[0], fourth_location_y[0])]
        #sensor_data = [generate_sensor_data_payload("0xD123", 12, 3)]
    else:
        sensor_data = [{}]  # Empty dictionary if source is not recognized
    
    response = make_response(jsonify(sensor_data))
    response.headers['Access-Control-Allow-Origin'] = '*'  # Allow requests from any origin
    return response

    

if __name__ == '__main__':
    app.run(debug=True)






