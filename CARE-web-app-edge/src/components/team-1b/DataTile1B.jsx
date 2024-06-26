import React from 'react'

export default function DataTile1B({pollutant, value, unit}) {
  let backgroundColorHex = "#FFFFFF";
  let AQIText = "";
  let textColor = "#000000";

  if (pollutant === "AQI") {
    textColor = "#FFFFFF";
    if (value >= 0 && value <= 50) {
      backgroundColorHex = "#024E1B";
      AQIText = "Good";
    } else if (value > 50 && value <= 75) {
      backgroundColorHex = "#FFE733";
      AQIText = "Moderate";
    } else if (value > 75 && value <= 100) {
      backgroundColorHex = "#FFAA1C";
      AQIText = "Unhealthy for sensitive groups"; 
    } else if (value > 100) {
      backgroundColorHex = "#ED2938";
      AQIText = "Unhealthy";
    }
  }
  
  return (
    <div className="data-tile-1b" style={{backgroundColor: backgroundColorHex, color: textColor}}>
        <div className="data-tile-pollutant-1b">
            {pollutant}
        </div>
        <div className="data-tile-value-1b">
            {pollutant === "AQI" ? `${AQIText}` : `${value} ${unit}`}
        </div>
    </div>
  )
}
