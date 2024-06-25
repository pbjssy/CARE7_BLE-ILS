import asyncio
from bleak import BleakScanner, BleakClient

#List of UUIDs to be used for filtering
SERVICE_UUIDS = [0xA123, 0xb123, 0xc123, 0xABCD, ['53ecfb05-f0fa-4bac-8bb3-75dc3fdb7de1']]

"""
async def scan_devices():
    devices = await BleakScanner.discover(return_adv=True)
    filtered_devices = [device for device in devices if any(service_uuid in device.AdvertisementData["uuids"] for service_uuid in SERVICE_UUIDS)]
    for device in filtered_devices:
        print(device.address)
    return filtered_devices

"""


"""
async def read_values(address):
    async with BleakClient(address) as client:
        # Replace "YOUR_CHARACTERISTIC_UUID" with the UUID of the characteristic
        value = await client.read_gatt_char("YOUR_CHARACTERISTIC_UUID")
        return value
"""
async def scan_devices():
    devices = await BleakScanner.discover(return_adv=True)
    rssi_received = 0
    # Assuming your data structure is stored in a variable called devices_data_dict
    for device, adv_data in devices.values():
        service_uuids = adv_data.service_uuids
        if service_uuids in SERVICE_UUIDS:
            rssi_received = int.from_bytes(adv_data.manufacturer_data[52651], byteorder='big', signed=False)
            print(f"Service UUIDs for device {device.address}: {service_uuids} with RSSI: {rssi_received}") #shows we can parse the data


    print(devices.values()) #shows the whole payload (address, advertisementData: uuids, tx_power, rssi)
   

async def main():
    devices = await scan_devices()

while True:
    asyncio.run(main())

