/*
 * Copyright (c) 2016 Intel Corporation
 *
 * SPDX-License-Identifier: Apache-2.0
 */

#include <zephyr/types.h>
#include <stddef.h>
#include <errno.h>
#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>
#include <stdlib.h> 

#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/conn.h>
#include <zephyr/bluetooth/uuid.h>
#include <zephyr/bluetooth/gatt.h>
#include <zephyr/sys/byteorder.h>

#include <zephyr/drivers/gpio.h>
#include <zephyr/logging/log.h>


/* 1000 msec = 1 sec */
#define SLEEP_TIME_MS   1000

/*Scanning Parameters, interval&window N*0.625ms */
//#define BLE_SCAN_PARAM BT_LE_SCAN_PARAM(BT_LE_SCAN_TYPE_PASSIVE, BT_LE_SCAN_OPT_FILTER_DUPLICATE, BT_GAP_SCAN_FAST_INTERVAL, BT_GAP_SCAN_FAST_WINDOW)
#define BLE_SCAN_PARAM BT_LE_SCAN_PARAM(BT_LE_SCAN_TYPE_PASSIVE, BT_LE_SCAN_OPT_FILTER_DUPLICATE, 0x50, 0x50)

/*Advertisement Parameters*/
//#define BLE_ADV_PARAM BT_LE_ADV_PARAM(0, BT_GAP_ADV_FAST_INT_MIN_2, BT_GAP_ADV_FAST_INT_MAX_2, NULL)
#define BLE_ADV_PARAM BT_LE_ADV_PARAM(0, 640, 960, NULL) //400*.625 = 250ms min. adv. interval;[640]  400ms max adv. interval
 

/*Global Variables*/
static int8_t global_rssi;



/*define UUID to advertise (Bluetooth gateway will use this UUID to filter this anchor )*/
//static struct bt_uuid_16 service_uuid = BT_UUID_16_ENCODE(0xABCD); // UUID that will not conflict with standard UUIDs
#define BT_UUID_MY_CUSTOM_SERV_VAL BT_UUID_128_ENCODE(0x53ecfb05, 0xf0fa, 0x4bac, 0x8bb3, 0x75dc3fdb7de1) //1
//#define BT_UUID_MY_CUSTOM_SERV_VAL BT_UUID_128_ENCODE(0xa6068d7c, 0x8e4e, 0x4b9f, 0x9309, 0x512c5e5bccd3) //2
//#define BT_UUID_MY_CUSTOM_SERV_VAL BT_UUID_128_ENCODE(0x1ca79355, 0xbd0b, 0x4748, 0x9ff5, 0xf5092e7eba9c) //3
//#define BT_UUID_MY_CUSTOM_SERV_VAL BT_UUID_128_ENCODE(0xf0f6776f, 0x44b6, 0x414e, 0x89de, 0xb82d4b9d031c) //4
//#define BT_UUID_MY_CUSTOM_SERV_VAL BT_UUID_128_ENCODE(0x2389ba13, 0x3039, 0x4dff, 0xaa6c, 0x5189ff96d0d7) //5 
//#define BT_UUID_MY_CUSTOM_SERV_VAL BT_UUID_128_ENCODE(0x1d4a883a, 0x712b, 0x497a, 0xbe68, 0x844c30ec59db) //6


#define BT_UUID_MY_CUSTOM_SERVICE BT_UUID_DECLARE_128(BT_UUID_MY_CUSTOM_SERV_VAL)

#define TARGET_ADDRESS "06:65:63:8B:F9:13 (random)"

/*RSSI array for four beacons
format: tx_a, rssi_a, tx_b, rssi_b, tx_c,...

*/
static uint8_t mfg_data[8] = {0, 200, 0, 200, 0, 200, 0, 200};

static const struct bt_data ad_rssi[] = {
	BT_DATA_BYTES(BT_DATA_UUID128_ALL, BT_UUID_MY_CUSTOM_SERV_VAL),
	BT_DATA_BYTES(BT_DATA_FLAGS, (BT_LE_AD_GENERAL|BT_LE_AD_NO_BREDR)),
	BT_DATA(BT_DATA_MANUFACTURER_DATA, mfg_data, sizeof(mfg_data)),
};


/* The devicetree node identifier for the "led0" alias. 1-green, 0-red */
#define LED0_NODE DT_ALIAS(led0)

/*
 * A build error on this line means your board is unsupported.
 * See the sample documentation for information on how to fix this.
 */
static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED0_NODE, gpios);

/*Start Advertising Function*/
static void start_adv(void){
	int err = bt_le_adv_start(BT_LE_ADV_NCONN, ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0);
	if (err) {
		printk("Advertising failed to start (err %d)\n", err);
		return;
	}
	return;
}


static void device_found(const bt_addr_le_t *addr, int8_t rssi, uint8_t type, struct net_buf_simple *ad){
        char addr_str[BT_ADDR_LE_STR_LEN];
		/* Convert BLE address to string */
		bt_addr_le_to_str(addr, addr_str, sizeof(addr_str));
		printk("Device address: %s\n", addr_str);
		
		if (strcmp(addr_str, TARGET_ADDRESS) == 0) {
		
			printk("Device address: %s\n", addr_str);

			printk("Payload:\n");
			for (int i = 0; i < ad->len; i++) {
				printk("%02X ", ad->data[i]);
			}
			printk("\n");
		}
		
		/*
		printk("Device address: %s\n", addr_str);

			printk("Payload:\n");
			for (int i = 0; i < ad->len; i++) {
				printk("%02X ", ad->data[i]);
			}
			printk("\n");
		*/
		


		/*Convert BLE addr to strong*/
        global_rssi = abs(rssi);
		//reset UUIDs per device found
		uint16_t received_uuid = 0;
		//printk("Umabot naman");
		/* Parse advertising data to find Tx Power Level */
		int8_t tx_power = 0; // Default value if Tx Power Level not found
		for (int i = 0; i < ad->len;) {
			uint8_t ad_len = net_buf_simple_pull_u8(ad); //1B length
			uint8_t ad_type = net_buf_simple_pull_u8(ad); //1B type
			//BT_DATA_UUID16_ALL
			if (ad_type == BT_DATA_TX_POWER) {
				tx_power = net_buf_simple_pull_u8(ad);
				//printk("Power Level: %d \n", tx_power);
			} else if (ad_type == BT_DATA_UUID16_ALL){
				uint8_t uuid_second_byte = net_buf_simple_pull_u8(ad);
				uint8_t uuid_first_byte = net_buf_simple_pull_u8(ad);
				received_uuid = (uuid_first_byte << 8) | uuid_second_byte;
				//printk("UUID KO: %X\n", received_uuid);
			}

		}
		
		//printk("%X\n", received_uuid);
		//Condition to alter the ad_rssi
		if (received_uuid == 0xA123) {
			mfg_data[0] = tx_power;
			mfg_data[1] = global_rssi;
			bt_le_adv_update_data(ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0); 
			//printk("Power Level: %d, UUID KO: %04X\n, RSSI: %d", tx_power, received_uuid, mfg_data[3]);
		} else if (received_uuid == 0xB123) {
			mfg_data[2] = tx_power;
			mfg_data[3] = global_rssi;
			bt_le_adv_update_data(ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0); 
			//printk("Power Level: %d, UUID KO: %04X\n, RSSI: %d", tx_power, received_uuid, mfg_data[7]);		
		} else if (received_uuid == 0xC123) {
			mfg_data[4] = tx_power;
			mfg_data[5] = global_rssi;
			bt_le_adv_update_data(ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0); 
			printk("Power Level: %d, UUID KO: %04X\n, RSSI: %d", tx_power, received_uuid, mfg_data[7]);		
		} else if (received_uuid == 0xD123) {
			mfg_data[6] = tx_power;
			mfg_data[7] = global_rssi;
			bt_le_adv_update_data(ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0); 
			//printk("Power Level: %d, UUID KO: %04X\n, RSSI: %d", tx_power, received_uuid, mfg_data[7]);		
		}

		//printk("MFG DATA: %X, %X, %d, %X, %X, %X, %d, %d \n", mfg_data[0], mfg_data[1], mfg_data[2], mfg_data[3], mfg_data[4], mfg_data[5], mfg_data[6], mfg_data[7]);
}



static void start_scan(void)
{
	int err;
	
	/* This demo doesn't require active scan */
	err = bt_le_scan_start(BLE_SCAN_PARAM, device_found);
	if (err) {
		printk("Scanning failed to start (err %d)\n", err);
		return;
	}

	printk("Scanning successfully started\n");
}



int main(void)
{	
    k_msleep(5000);
	printk("Hello World! %s\n", CONFIG_BOARD);

        int err;

	err = bt_enable(NULL);
	if (err) {
		printk("Bluetooth init failed (err %d)\n", err);
		return 0;
	}

	printk("Bluetooth initialized\n");

	

	//led things
	int ret;

	if (!gpio_is_ready_dt(&led)) {
		return 0;
	}

	ret = gpio_pin_configure_dt(&led, GPIO_OUTPUT_ACTIVE);
	if (ret < 0) {
		return 0;
	}
	start_scan();
	start_adv();
	while (1) {
		start_scan();
		k_msleep(2000);
		//mfg_data[2] = 0;
		//mfg_data[3] = 200;
		//mfg_data[6] = 0;
		//mfg_data[7] = 200;
		err = bt_le_scan_stop();
		if (err) {
			printk("Stop LE scan failed (err %d)\n", err);
			continue;
		}
	}

	return 0;
}


