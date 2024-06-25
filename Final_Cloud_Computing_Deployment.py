from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn import metrics  
import numpy as np
import joblib
import asyncio
from bleak import BleakScanner, BleakClient 
import json
import paho.mqtt.publish as publish
import time



# MQTT connection settings
cluster_url = "ed7632329e6e4fbcbe77b1fa917585a1.s1.eu.hivemq.cloud"
port = 8883
username = "drsalinassy"
password = "UPCAREteam1F@2024"

# MQTT topic
topic = "UPCARE/UNDERGRAD/BLE_ILS"

def generate_payload(uuid, x_location, y_location, date_time):
    payload = {
        "source": uuid,
        "x_location": x_location,
        "y_location": y_location,
        "local_time": date_time,
        "type": 'data'
    }
    
    return payload


def publish_to_upcare(payload):
    try:
        # Connect to the MQTT broker
        auth = {'username': username, 'password': password}
        #publish.single(topic, json.dumps(payload), hostname=cluster_url, port=port, auth=auth, tls={"ca_certs": "/etc/ssl/certs/ca-certificates.crt"})
        #publish.single(topic, json.dumps(payload), hostname=cluster_url, port=port, auth=auth, tls={"ca_certs": "ssl-cert.cer"})
        publish.single(topic, json.dumps(payload), hostname=cluster_url, port=port, auth=auth, tls={"ca_certs": "cacert.pem"})
        print("Data published successfully to UP CARE Platform.")
    except Exception as e:
        print(f"Error publishing data: {e}")
"""
def predict_location(classifier, RSSI_1, RSSI_2, RSSI_3, RSSI_4, RSSI_5, RSSI_6, TxPowerLevel):
    predict_sample = pd.DataFrame({'RSS_1': RSSI_1, 'RSS_2': RSSI_2, 'RSS_3': RSSI_3, 'RSS_4': RSSI_4, 'RSS_5': RSSI_5, 'RSS_6': RSSI_6, 'TxPower': TxPowerLevel}, index=[0])
    return classifier.predict(predict_sample)
"""
def predict_location(classifier, RSSI_1, RSSI_3, RSSI_4, RSSI_5, TxPowerLevel):
    predict_sample = pd.DataFrame({'RSS_1': RSSI_1, 'RSS_3': RSSI_3, 'RSS_4': RSSI_4, 'RSS_5': RSSI_5, 'TxPower': TxPowerLevel}, index=[0])
    return classifier.predict(predict_sample)


model_1 = joblib.load('x_random_forest_model_4anc.pkl')
model_2 = joblib.load('y_random_forest_model_4anc.pkl')
#81, 77, 78, 83, 89, 86, -10
#6.66818 
#predicted = predict_location(model_1, 81, 77, 78, 83, 89, 86, -10)
#print(predicted)

def print_function (arr_1):
    for i in arr_1:
        print(i, end=', ')
    print()

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

async def scan_devices():
    devices = await BleakScanner.discover(timeout=1, return_adv=True)
    for device, adv_data in devices.values():
        service_uuids = adv_data.service_uuids
        if service_uuids == ['53ecfb05-f0fa-4bac-8bb3-75dc3fdb7de1']:
            parse_manufacture_data(adv_data.manufacturer_data, 0, first_beacon, second_beacon, third_beacon, fourth_beacon)

            #print(needed_data)
            #ad_received = int.from_bytes(adv_data.manufacturer_data[52651], byteorder='big', signed=False)
            #hex_repr = hex(ad_received)
            #print("Hex Representation: ", hex_repr)
            #frst_beacon[0] = adv_data.manufacturer_data[52651][1] #rssi received by anchor 1 for beacon 1
            #frst_beacon[4] = struct.unpack('b', struct.pack('B', adv_data.manufacturer_data[52651][0]))[0]
            #secd_beacon[0] = adv_data.manufacturer_data[52651][5] #rssi received by anchor 1 for beacon 2
            #secd_beacon[4] = struct.unpack('b', struct.pack('B', adv_data.manufacturer_data[52651][4]))[0]
        elif (service_uuids == ['a6068d7c-8e4e-4b9f-9309-512c5e5bccd3']):
            parse_manufacture_data(adv_data.manufacturer_data, 1, first_beacon, second_beacon, third_beacon, fourth_beacon)
            #frst_beacon[1] = adv_data.manufacturer_data[52651][1] #rssi received by anchor 2 for beacon 1
            #secd_beacon[1] = adv_data.manufacturer_data[52651][5] #rssi received by anchor 1 for beacon 2
        elif (service_uuids == ['1ca79355-bd0b-4748-9ff5-f5092e7eba9c']):
            parse_manufacture_data(adv_data.manufacturer_data, 2, first_beacon, second_beacon, third_beacon, fourth_beacon)
            #frst_beacon[2] = adv_data.manufacturer_data[52651][1] #rssi received by anchor 3
            #secd_beacon[2] = adv_data.manufacturer_data[52651][5] #rssi received by anchor 1 for beacon 2
        elif (service_uuids == ['f0f6776f-44b6-414e-89de-b82d4b9d031c']):
            parse_manufacture_data(adv_data.manufacturer_data, 3, first_beacon, second_beacon, third_beacon, fourth_beacon)
            #frst_beacon[3] = adv_data.manufacturer_data[52651][1] #rssi received by anchor 4     
            #secd_beacon[3] = adv_data.manufacturer_data[52651][5] #rssi received by anchor 1 for beacon 2
        elif (service_uuids == ['2389ba13-3039-4dff-aa6c-5189ff96d0d7']):
            parse_manufacture_data(adv_data.manufacturer_data, 4, first_beacon, second_beacon, third_beacon, fourth_beacon)
            #frst_beacon[3] = adv_data.manufacturer_data[52651][1] #rssi received by anchor 4     
            #secd_beacon[3] = adv_data.manufacturer_data[52651][5] #rssi received by anchor 1 for beacon 2
        elif (service_uuids == ['1d4a883a-712b-497a-be68-844c30ec59db']):
            parse_manufacture_data(adv_data.manufacturer_data, 5, first_beacon, second_beacon, third_beacon, fourth_beacon)
            #frst_beacon[3] = adv_data.manufacturer_data[52651][1] #rssi received by anchor 4     
            #secd_beacon[3] = adv_data.manufacturer_data[52651][5] #rssi received by anchor 1 for beacon 2   

    #print_function(first_beacon, second_beacon, third_beacon, fourth_beacon)
    #first_location_x = predict_location(model_1, first_beacon[0], first_beacon[1], first_beacon[2], first_beacon[3], first_beacon[4], first_beacon[5], first_beacon[6])
    #first_location_y = predict_location(model_2, first_beacon[0], first_beacon[1], first_beacon[2], first_beacon[3], first_beacon[4], first_beacon[5], first_beacon[6])
    first_location_x = predict_location(model_1, first_beacon[0], first_beacon[2], first_beacon[3], first_beacon[4], first_beacon[6])
    first_location_y = predict_location(model_2, first_beacon[0], first_beacon[2], first_beacon[3], first_beacon[4], first_beacon[6])
    
    #print("X1 is at ", first_location_x)
    #print("Y1 is at ", first_location_y)
    #second_location_x = predict_location(model_1, second_beacon[0], second_beacon[1], second_beacon[2], second_beacon[3], second_beacon[4], second_beacon[5], second_beacon[6])
    #second_location_y = predict_location(model_2, second_beacon[0], second_beacon[1], second_beacon[2], second_beacon[3], second_beacon[4], second_beacon[5], second_beacon[6])
    #third_location_x = predict_location(model_1, third_beacon[0], third_beacon[1], third_beacon[2], third_beacon[3], third_beacon[4], third_beacon[5], third_beacon[6])
    #third_location_y = predict_location(model_2, third_beacon[0], third_beacon[1], third_beacon[2], third_beacon[3], third_beacon[4], third_beacon[5], third_beacon[6])
    #fourth_location_x = predict_location(model_1, fourth_beacon[0], fourth_beacon[1], fourth_beacon[2], fourth_beacon[3], fourth_beacon[4], fourth_beacon[5], fourth_beacon[6])
    #fourth_location_y = predict_location(model_2, fourth_beacon[0], fourth_beacon[1], fourth_beacon[2], fourth_beacon[3], fourth_beacon[4], fourth_beacon[5], fourth_beacon[6])
    
    second_location_x = predict_location(model_1, second_beacon[0], second_beacon[2], second_beacon[3], second_beacon[4], second_beacon[6])
    second_location_y = predict_location(model_2, second_beacon[0], second_beacon[2], second_beacon[3], second_beacon[4], second_beacon[6])
    third_location_x = predict_location(model_1, third_beacon[0], third_beacon[2], third_beacon[3], third_beacon[4], third_beacon[6])
    third_location_y = predict_location(model_2, third_beacon[0], third_beacon[2], third_beacon[3], third_beacon[4], third_beacon[6])
    fourth_location_x = predict_location(model_1, fourth_beacon[0], fourth_beacon[2], fourth_beacon[3], fourth_beacon[4], fourth_beacon[6])
    fourth_location_y = predict_location(model_2, fourth_beacon[0], fourth_beacon[2], fourth_beacon[3], fourth_beacon[4], fourth_beacon[6])
    
    #print("X4 is at ", fourth_location_x)
    #print("Y4 is at ", fourth_location_y)
    #print("Time of predicting: ", end_time - start_time)
    
    # Generate payload with dynamic values
    print(first_location_x[0])
    print(first_location_y[0])
    date_time = time.strftime("%Y-%m-%dT%H:%M:%S")
    payload = generate_payload("0xA123", float(first_location_x[0]), float(first_location_y[0]), date_time)
    #alpha_time = time.time()
    publish_to_upcare(payload)
    #omega_time = time.time()
    #print("WHOLE TIME1: ", omega_time - alpha_time)
    payload = generate_payload("0xB123", float(second_location_x[0]), float(second_location_y[0]), date_time)
    publish_to_upcare(payload)
    #payload = generate_payload("0xC123", float(third_location_x[0]), float(third_location_y[0]), date_time)
    #publish_to_upcare(payload)
    #print(fourth_location_x[0])
    #print(fourth_location_y[0])
    payload = generate_payload("0xD123", float(fourth_location_x[0]), float(fourth_location_y[0]), date_time)
    #alpha_time = time.time()
    publish_to_upcare(payload)
    #omega_time = time.time()
    #print("WHOLE TIME3: ", omega_time - alpha_time)



async def main():
    while True:
        await asyncio.gather(scan_devices()) 

asyncio.run(main())






