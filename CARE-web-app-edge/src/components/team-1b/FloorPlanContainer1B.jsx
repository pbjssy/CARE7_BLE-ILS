import React from 'react'
import AVR1B from './floorplans-1b/AVR1B';
import AdminOffice1B from './floorplans-1b/AdminOffice1B';
import CareOffice1B from './floorplans-1b/CareOffice1B';
import SeminarRoom1B from './floorplans-1b/SeminarRoom1B';
import Stairs1B from './floorplans-1b/Stairs1B';
import DataTable1B from './DataTable1B';

export default function FloorPlanContainer1B({FloorCode}) {
    let FacilityComponent;
    let DataTable;
    let FacilityName;

    if (FloorCode == 0) {
        FacilityComponent = <AVR1B />
        FacilityName = "Audio Visual Room"
    } else if (FloorCode == 1) {
        FacilityComponent = <Stairs1B />
        FacilityName = "1st-2nd Floor Stairs"
    } else if (FloorCode == 2) {
        FacilityComponent = <AdminOffice1B />
        FacilityName = "Admin Office"
    } else if (FloorCode == 3) {
        FacilityComponent = <SeminarRoom1B />
        FacilityName = "Seminar Room"
    } else if (FloorCode == 4) {
        FacilityComponent = <CareOffice1B />
        FacilityName = "CARE Office"
    }
    return (
        <div className='floorplan-container-1b'>
            {FacilityComponent}
        </div>
    )
}
