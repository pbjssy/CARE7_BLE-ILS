from openpyxl import load_workbook
import os

print(os.getcwd())
# Load the workbook
workbook = load_workbook('C:/Users/Bryan/Desktop/Thesis/Calibration.xlsx')

# Select the active worksheet
sheet = workbook.active

# Data to append (assuming it's a list of values)
new_row_data = [2, 3, 4]

# Append the new row
sheet.append(new_row_data)

# Save the workbook
workbook.save('C:/Users/Bryan/Desktop/Thesis/Calibration.xlsx')
