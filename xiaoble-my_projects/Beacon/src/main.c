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

/*Advertisement Parameters*/
//#define BLE_ADV_PARAM BT_LE_ADV_PARAM(0, BT_GAP_ADV_FAST_INT_MIN_2, BT_GAP_ADV_FAST_INT_MAX_2, NULL)
#define BLE_ADV_PARAM BT_LE_ADV_PARAM(1, 160, 240, NULL) //400*.625 = 250ms min. adv. interval; 400ms max adv. interval


/*define UUID to advertise (Bluetooth gateway will use this UUID to filter this anchor )*/
#define BT_DEVICE_UUID BT_UUID_16_ENCODE(0xC123)
#define BT_TX_POWER BT_TX_POWER_LEVEL_CURRENT

/*Tx Power*/


static const struct bt_data ad_rssi[] = {
	BT_DATA_BYTES(BT_DATA_FLAGS, (BT_LE_AD_GENERAL|BT_LE_AD_NO_BREDR)),
	BT_DATA_BYTES(BT_DATA_TX_POWER, BT_TX_POWER),
	BT_DATA_BYTES(BT_DATA_UUID16_ALL, BT_DEVICE_UUID),



	//BT_DATA(BT_DATA_MANUFACTURER_DATA, mfg_data, sizeof(mfg_data)),
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
	//int err = bt_le_adv_start(BLE_ADV_PARAM, ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0);
    int err = bt_le_adv_start(BT_LE_ADV_NCONN, ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0);

	//int err = bt_le_adv_start(, ad_rssi, ARRAY_SIZE(ad_rssi), NULL, 0);
	if (err) {
		printk("Advertising failed to start (err %d)\n", err);
		return;
	}
	return;
}


int main(void)
{	
    k_msleep(5000);
	//led things
	int ret;
	ret = gpio_pin_configure_dt(&led, GPIO_OUTPUT_ACTIVE);
	if (ret < 0) {
		return 0;
	}
	if (!gpio_is_ready_dt(&led)) {
		return 0;
	}

	printk("Hello World! %s\n", CONFIG_BOARD);

    int err;

	err = bt_enable(NULL);
	if (err) {
		printk("Bluetooth init failed (err %d)\n", err);
		return 0;
	}

	printk("Bluetooth initialized\n");
	
	start_adv();
	while (1) {
		printk("Please\n");
		k_msleep(1000);
	
	}

	return 0;
}


