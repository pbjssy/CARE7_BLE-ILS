import asyncio
from bleak import BleakScanner, BleakClient
import struct
from openpyxl import load_workbook
import os
import atexit
import datetime
import ctypes


#this code is for dataset collection
#it outputs the dataset to the terminal and is copy pasted to the
#dataset sheet; automation was tried beforehand wherein we automatically saves each new sample to the sheet
#however, corruption of the file was frequent hence was not pursued further.


# Load the workbook
#workbook = load_workbook('C:/Users/Bryan/Desktop/Thesis/Calibration_2.xlsx')

# Select the active worksheet
#sheet = workbook.active

#anchor UUIDs
#['53ecfb05-f0fa-4bac-8bb3-75dc3fdb7de1']
#['a6068d7c-8e4e-4b9f-9309-512c5e5bccd3']
#['1ca79355-bd0b-4748-9ff5-f5092e7eba9c']
#['f0f6776f-44b6-414e-89de-b82d4b9d031c']
#['f0f6776f-44b6-414e-89de-b82d4b9d031c']

#List of Beacons UUID
#[RSSI_a, RSSI_b, RSSI_c, RSSI_d, RSSI_e, TxPower, UUID of Phone ]
first_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xA123)]
second_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xB123)]  
third_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xC123)]
fourth_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xD123)]
#fifth_beacon = [200, 200, 200, 200, 200, 200, 0, hex(0xD123)] 


#convery 8bit value to its signed integer 
def to_signed_int(value):
    if value & (1 << 7):
        return -(256 - value)
    else:
        return value
#Printing Function
def print_function (arr_1, arr_2, arr_3, arr_4):
    for i in arr_1:
        print(i, end=' ')
    for i in arr_2:
        print(i, end=' ')
    for i in arr_3:
        print(i, end=' ')
    for i in arr_4:
        print(i, end=' ')
    print()

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


    
    #print(frst_beacon)
    #print(secd_beacon)
    # Append the new row
    #sheet.append(frst_beacon)
    #sheet.append(secd_beacon)
    #print(frst_beacon)
    #print(frst_beacon[0], frst_beacon[1], frst_beacon[2], frst_beacon[3], frst_beacon[4], frst_beacon[5], frst_beacon[6],sep=",")
    #print(first_beacon + second_beacon + third_beacon + fourth_beacon)
    print_function(first_beacon, second_beacon, third_beacon, fourth_beacon)
    #print(datetime.datetime.now(), secd_beacon)
    # Save the workbook
    #workbook.save('C:/Users/Bryan/Desktop/Thesis/Calibration_2.xlsx')
    
    #ad_received = int.from_bytes(adv_data.manufacturer_data[52651], byteorder='big', signed=False)
    #hex_repr = hex(rssi_received)
    #print("Hex Representation: ", hex_repr)
    #print(f"Service UUIDs for device {device.address}: {service_uuids} with RSSI: {rssi_received}") #shows we can parse the data
    #print(devic,es.values()) #shows the whole payload (address, advertisementData: uuids, tx_power, rssi)



async def main():
    while True:
        await asyncio.gather(scan_devices()) 

asyncio.run(main())




