# importing required libraries
# importing Scikit-learn library and datasets package
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
from sklearn import metrics  
import numpy as np
import sys
import joblib
import time
import os
import matplotlib.pyplot as plt

def predict_location(classifier, RSSI_1, RSSI_2, RSSI_3, RSSI_4, RSSI_5, RSSI_6, TxPowerLevel):
    predict_sample = pd.DataFrame({'RSS_1': RSSI_1, 'RSS_2': RSSI_2, 'RSS_3': RSSI_3, 'RSS_4': RSSI_4, 'RSS_5': RSSI_5, 'RSS_6': RSSI_6, 'TxPower': TxPowerLevel}, index=[0])
    return classifier.predict(  predict_sample)



# Load data
#data1 = pd.read_csv('Data/OppoA16_BLE5_Regression.csv',header=0)
#data2 = pd.read_csv('Data/Samsung_BLE5_Regression.csv', header=0)
#data3 = pd.read_csv('Data/OppoA5_BLE3_Regression.csv', header=0)
#data4 = pd.read_csv('Data/OppoA16_BLE5_Regression_SampleLive.csv',header=0)
data1 = pd.read_csv('Data/4Anchors_BLE5_OppoA16.csv',header=0)
data2 = pd.read_csv('Data/4Anchors_BLE5_Samsung.csv', header=0)
data3 = pd.read_csv('Data/4Anchors_BLE3_OppoA5.csv', header=0)
data5 = pd.read_csv('Data/THESIS REFERENCE DATABASE - MCU Beacon.csv',header=0)


#data5 = pd.read_csv('Data/4Anchors1Beacon.csv', header=0)
#data1 = data1.iloc[:4052]
#data2 = data2.iloc[:4052]
#data3 = data3.iloc[:4052]

#data4 = pd.read_csv('Data/OppoA16_BLE5_Regression_SampleLive.csv',header=0)
#data4 = pd.read_csv('Data/THESIS REFERENCE DATABASE - 1 Beacon.csv',header=0)
#data4 = pd.read_csv('Data/4AnchorsLive_ALL.csv',header=0)
#data4 = pd.read_csv('Data/THESIS REFERENCE DATABASE - 2 Beacons.csv',header=0)
#data4 = pd.read_csv('Data/THESIS REFERENCE DATABASE - 3 Beacons.csv',header=0)
data4 = pd.read_csv('Data/THESIS REFERENCE DATABASE - MCU LIVE.csv',header=0)



#data5 = pd.read_csv('Data/4AnchorsLive_BLE5_Samsung.csv',header=0)
#data6 = pd.read_csv('Data/4AnchorsLive_BLE3_OppoA5.csv',header=0)



merged_data = pd.concat([data1, data2, data3, data5], ignore_index=True)
#merged_data = data5

X = merged_data.drop(columns=['xRegression', 'yRegression'])
y_x = merged_data['xRegression']
y_y = merged_data['yRegression']

#data4 things
#live_merge = pd.concat([data4, data5, data6], ignore_index=True)
predictors_samples = data4.drop(columns=['xRegression', 'yRegression'])
y_sample = data4['yRegression']
x_sample = data4['xRegression']

#Splitting into train and test ds
X_train, X_test, y_train, y_test = train_test_split(X, y_x, test_size=0.2, random_state=13) 
X_train_a, X_test_a, y_train_a, y_test_a = train_test_split(X, y_y, test_size=0.2, random_state=13) 


#model for x
#model_1 = joblib.load('x_random_forest_model.pkl')
#model_2 = joblib.load('y_random_forest_model.pkl')

model_1 = RandomForestRegressor(n_estimators=110)
model_1.fit(X_train, y_train)
joblib.dump(model_1, 'x_random_forest_model_4anc.pkl')

model_2 = RandomForestRegressor(n_estimators=110)
model_2.fit(X_train_a, y_train_a)
joblib.dump(model_2, 'y_random_forest_model_4anc.pkl')


#X's
#predictions = model_1.predict(X_test)
predictions = model_1.predict(predictors_samples)
errors = x_sample - predictions
# Calculate absolute prediction errors
abs_errors = np.abs(errors)
# Sort absolute prediction errors
sorted_abs_errors = np.sort(abs_errors)
# Calculate cumulative percentage of data points within each error threshold
cumulative_percentage = np.arange(1, len(sorted_abs_errors) + 1) / len(sorted_abs_errors) * 100
# Plot location error vs cumulative percentage
plt.figure(figsize=(10, 6))
plt.plot(sorted_abs_errors, cumulative_percentage, marker='o', linestyle='-')
plt.xlabel('X Location Error (m)')
plt.ylabel('Cumulative Percentage (%)')
plt.title('Cumulative Percentage VS X Location Error')
plt.grid(True)
plt.xticks(np.arange(0, max(sorted_abs_errors) + 0.5, 0.5))
plt.yticks(np.arange(0, 101, 10))
plt.show()

#Y's
#predictions1 = model_2.predict(X_test_a)
predictions1 = model_2.predict(predictors_samples)
errors1 = y_sample - predictions1
# Calculate absolute prediction errors
abs_errors1 = np.abs(errors1)
# Sort absolute prediction errors
sorted_abs_errors1 = np.sort(abs_errors1)
# Calculate cumulative percentage of data points within each error threshold
cumulative_percentage1 = np.arange(1, len(sorted_abs_errors1) + 1) / len(sorted_abs_errors1) * 100
# Plot location error vs cumulative percentage
plt.figure(figsize=(10, 6))
plt.plot(sorted_abs_errors1, cumulative_percentage1, marker='o', linestyle='-')
plt.xlabel('y Location Error (m)')
plt.ylabel('Cumulative Percentage (%)')
plt.title('Cumulative Percentage VS Y Location Error')
plt.grid(True)
plt.yticks(np.arange(0, 101, 10))
plt.show()
