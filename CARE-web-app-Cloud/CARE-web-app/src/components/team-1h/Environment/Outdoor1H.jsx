import React, {useContext, useEffect} from "react";
// import { NECFloorContext, NECNodeContext } from "../../../pages/Team1B";

export default function Outdoor1H() {
    // const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);
    // const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
    // const place = "Audio Visual Room";
    // const HandlerRoomClick = (facility, room) => {
    //     return () => {const newLocation = {
    //         facility: facility,
    //         room: room
    //     }
    //     setLocation(newLocation)
    //     setOpenModal(true)
    //     console.log(newLocation)
    //     }
    // }

    // useEffect(() => {
    //     setNodeDetails({
    //         node: 1,
    //         facility: place,
    //         type: "Indoor",
    //         withWind: false
    //     })
    // }, [floor]) 
    return (
        <div className="outdoor-map-container-1h">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123504.21022922019!2d120.97978816674632!3d14.683921220321473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ba0942ef7375%3A0x4a9a32d9fe083d40!2sQuezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1711780062690!5m2!1sen!2sph" className="bus-map-1h" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    )
}