import React, {useContext, useEffect} from "react";
import { NECFloorContext, NECNodeContext } from "../../../pages/Team1B";
import SensorNode1B from "../SensorNode1B";

export default function AVR1B() {
    const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);
    const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
    const place = "Audio Visual Room";
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
            node: 1,
            facility: place,
            type: "Indoor",
            withWind: false
        })
    }, [floor]) 
    return (
        <div className="avr-1b">
            <div className="avr-stage-1b" onClick={HandlerRoomClick(place, "Stage")}>STAGE</div>
            <div className="avr-stage-door-1b"></div>
            <div className="avr-audience-1b" onClick={HandlerRoomClick(place, "Main Room")}></div>
            <div className="avr-hallway-1b" onClick={HandlerRoomClick(place, "Hallway")}>HALLWAY</div>
            <div className="avr-audience-door-1b"></div>
            <div className="avr-chairs-1b" onClick={HandlerRoomClick(place, "Chairs")}>CHAIRS</div>
            <SensorNode1B nodeId="node1-1b" nodeNumber={1} withWind={false} type="Indoor" facility={[place]}/>
            <SensorNode1B nodeId="node2-1b" nodeNumber={2} withWind={false} type="Indoor" facility={[place]}/>
            <SensorNode1B nodeId="anem1-1b" nodeNumber={3} withWind={true} type="Indoor" facility={[place]} angleOffset={90}/>
            <SensorNode1B nodeId="node5-1b" nodeNumber={4} withWind={false} type="Outdoor" facility={[place]}/>
            <SensorNode1B nodeId="anem2-1b" nodeNumber={5} withWind={true} type="Outdoor" facility={[place]} angleOffset={90}/>
        </div>
    )
}