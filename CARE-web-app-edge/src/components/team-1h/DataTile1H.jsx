import React from 'react'

export default function DataTile1H({pollutant, value}) {
  return (
    <div className="data-tile-1h">
        <div className="data-tile-pollutant-1h">
            {pollutant}
        </div>
        <div className="data-tile-value-1h">
            {value}
        </div>
    </div>
  )
}
