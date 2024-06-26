import React, {useContext, useEffect} from 'react'
import { NECFloorContext, NECNodeContext } from '../../../pages/Team1B';
import SensorNode1B from '../SensorNode1B';

export default function Stairs1B() {
  const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);
  const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
  const place = "1st-2nd Floor Stairwell";
  const HandlerRoomClick = (facility, room) => {
      return () => {const newLocation = {
          facility: facility,
          room: room
      }
      setLocation(newLocation)
      setOpenModal(true)
      console.log(newLocation)
      }
  }
  useEffect(() => {
    setNodeDetails({
        node: 6,
        facility: place,
        type: "Outdoor",
        withWind: false
    })
  }, [floor]) 
  return (
    <div className="stairs-1b">
        <div className="stairs-platform-1b" onClick={HandlerRoomClick(place, "Stairs Platform")}>Platform</div>
        <div className="stairs-hallway-1b" onClick={HandlerRoomClick(place, "Hallway")}>Hallway</div>
        <div className="stairs-to-platform-1b" onClick={HandlerRoomClick(place, "Stairs 1")}>Stairs to platform</div>
        <div className="stairs-to-2nd-floor-1b" onClick={HandlerRoomClick(place, "Stairs 2")}>Stairs to 2nd floor</div>
        <SensorNode1B nodeId="node6-1b" nodeNumber={6} withWind={false} type="Outdoor" facility={[place]}/>
        {/* <SensorNode1B nodeId="anem3-1b" nodeNumber={7} withWind={true} type="Outdoor" facility={[place]}/> */}
    </div>
  )
}
