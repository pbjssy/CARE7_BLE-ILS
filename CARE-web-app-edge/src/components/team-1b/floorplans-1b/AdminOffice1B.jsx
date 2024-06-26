import React, {useContext, useEffect} from "react";
import { NECFloorContext, NECNodeContext } from "../../../pages/Team1B";
import SensorNode1B from "../SensorNode1B";

export default function AdminOffice1B() {
    const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);
    const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
    const place = "Admin Office";
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
            node: 7,
            facility: place,
            type: "Indoor",
            withWind: false
        })
    }, [floor])
    return (
        <div className="admin-office-1b">
            <div className="admin-room-1b" onClick={HandlerRoomClick(place, "Sub Room")}>Sub Room</div>
            <div className="admin-room-door-1b"></div>
            <div className="admin-main-1b" onClick={HandlerRoomClick(place, "Lobby")}>Lobby</div>
            <div className="admin-main-door-1b"></div>
            <div className="admin-hallway-1b" onClick={HandlerRoomClick(place, "Hallway")}>Hallway</div>
            <SensorNode1B nodeId="node7-1b" nodeNumber={7} withWind={false} type="Indoor" facility={[place]}/>
            <SensorNode1B nodeId="node8-1b" nodeNumber={8} withWind={false} type="Indoor" facility={[place]}/>
            <SensorNode1B nodeId="anem3-1b" nodeNumber={9} withWind={true} type="Indoor" facility={[place]} angleOffset={90}/>
            <SensorNode1B nodeId="anem4-1b" nodeNumber={10} withWind={true} type="Outdoor" facility={[place]} angleOffset={90}/>
            <SensorNode1B nodeId="node11-1b" nodeNumber={11} withWind={false} type="Outdoor" facility={[place]}/>
        </div>
    )
}