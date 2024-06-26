import React, {useContext, useEffect} from 'react'
import { NECFloorContext, NECNodeContext } from '../../../pages/Team1B';
import SensorNode1B from '../SensorNode1B';

export default function SeminarRoom1B() {
  const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);
  const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
  const place = "Seminar Room";
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
        node: 12,
        facility: place,
        type: "Indoor",
        withWind: false
    })
  }, [floor])
  return (
    <div className="seminar-room-1b">
        <div className="seminar-main-room-1b" onClick={HandlerRoomClick(place, "Seminar Room")}>Seminar Room</div>
        <div className="seminar-hallway-1b" onClick={HandlerRoomClick(place, "Hallway")}>Hallway</div>
        <div className="seminar-main-door-1-1b"></div>
        <div className="seminar-main-door-2-1b"></div>
        <SensorNode1B nodeId="node12-1b" nodeNumber={12} withWind={false} type="Indoor" facility={[place]}/>
        <SensorNode1B nodeId="anem5-1b" nodeNumber={13} withWind={true} type="Indoor" facility={[place]} angleOffset={90}/>    
        <SensorNode1B nodeId="node14-1b" nodeNumber={14} withWind={false} type="Outdoor" facility={[place]}/>
        <SensorNode1B nodeId="anem6-1b" nodeNumber={15} withWind={true} type="Outdoor" facility={[place]} angleOffset={90}/>
    </div>
  )
}
