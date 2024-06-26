import React from 'react'

export default function StatusTile1H() {
  return (
    <div className="tile-container-1h">
		<h2>Status</h2>
		<div className="stat-container-1h">
			<h3>Air Quality Status</h3>
			<h3 id="poor">poor</h3>
		</div>
		<div className="stat-container-1h">
			<h3>Passenger Occupancy</h3>
			<h3 id="occu">27%</h3>
		</div>
	</div>
  )
}