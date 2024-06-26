import React, {useContext, useEffect} from 'react'
import { NECFloorContext, NECNodeContext } from '../../../pages/Team1B';
import SensorNode1B from '../SensorNode1B';

export default function CareOffice1B() {
  const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);
  const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
  const place = "CARE Office";
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
        node: 16,
        facility: place,
        type: "Indoor",
        withWind: false
    })
  }, [floor])
  return (
    <div className="care-office-1b">
        <div className="care-office-lobby-1b" onClick={HandlerRoomClick(place, "Lobby")}>Lobby</div>
        <div className="care-office-lobby-door-1b"></div>
        <div className="care-office-room-1-1b" onClick={HandlerRoomClick(place, "Sub Room 1")}>Sub Room 1</div>
        <div className="care-office-room-1-door-1b"></div>
        <div className="care-office-room-2-1b" onClick={HandlerRoomClick(place, "Sub Room 2")}>Sub Room 2</div>
        <div className="care-office-room-2-door-1b"></div>
        <div className="care-office-hallway-1b" onClick={HandlerRoomClick(place, "Hallway")}>Hallway</div>
        <SensorNode1B nodeId="node16-1b" nodeNumber={16} withWind={false} type="Indoor" facility={[place]}/>
        <SensorNode1B nodeId="node17-1b" nodeNumber={17} withWind={false} type="Indoor" facility={[place]}/>
        <SensorNode1B nodeId="node18-1b" nodeNumber={18} withWind={false} type="Indoor" facility={[place]}/>
        <SensorNode1B nodeId="anem8-1b" nodeNumber={19} withWind={true} type="Indoor" facility={[place]} angleOffset={90}/>
        <SensorNode1B nodeId="anem9-1b" nodeNumber={20} withWind={true} type="Outdoor" facility={[place]} angleOffset={90}/>
        <SensorNode1B nodeId="node21-1b" nodeNumber={21} withWind={false} type="Outdoor" facility={[place]}/>
    </div>
  )
}
