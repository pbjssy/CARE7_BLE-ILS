import React, {useContext} from 'react'
import { NECFloorContext } from '../../pages/Team1B';
import AVRChairs from '../../assets/team-1b/AVR-Chairs.jpg';
import AVRHallway from '../../assets/team-1b/AVR-Hallway.jpg';
import AVRMainRoom from '../../assets/team-1b/AVR-Main-Room.jpg';
import AdminLobby from '../../assets/team-1b/Admin-Lobby.jpg';
import AdminSubRoom from '../../assets/team-1b/Admin-Sub-Room.jpg';
import AdminHallway from '../../assets/team-1b/Admin-Hallway.jpg';
import SeminarRoom from '../../assets/team-1b/Seminar-Room.jpg';
import NECEntrance from '../../assets/team-1b/NEC-Entrance.jpg';
import CAREHallway from '../../assets/team-1b/CARE-Hallway.jpg';
import Stairs1 from '../../assets/team-1b/Stairs-to-platform.jpg';
import StairsPlatform from '../../assets/team-1b/Stairs-Platform.jpg';
import Stairs2 from '../../assets/team-1b/Stairs-to-2nd.jpg';


export default function Modal1B() {
    let ImageSrc;
    const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext);

    if (location.facility == "Audio Visual Room") {
        if (location.room == "Hallway") {
            ImageSrc = AVRHallway;
        } else if (location.room == "Chairs") {
            ImageSrc = AVRChairs;
        } else if (location.room == "Stage") {

        } else if (location.room == "Main Room") {
            ImageSrc = AVRMainRoom;
        }
    } else if (location.facility == "1st-2nd Floor Stairwell") {
        if (location.room == "Hallway") {
            ImageSrc = NECEntrance;
        } else if (location.room == "Stairs 1") {
            ImageSrc = Stairs1;
        } else if (location.room == "Stairs 2") {
            ImageSrc = Stairs2;
        } else if (location.room == "Stairs Platform") {
            ImageSrc = StairsPlatform;
        }
    } else if (location.facility == "Admin Office") {
        if (location.room == "Hallway") {
            ImageSrc = AdminHallway;
        } else if (location.room == "Lobby") {
            ImageSrc = AdminLobby;
        } else if (location.room == "Sub Room") {
            ImageSrc = AdminSubRoom;
        }
    } else if (location.facility == "Seminar Room") {
        if (location.room == "Seminar Room") {
            ImageSrc = SeminarRoom;
        } else if (location.room == "Hallway") {

        }
    } else if (location.facility == "CARE Office") {
        if (location.room == "Hallway") {
            ImageSrc = CAREHallway;
        }
    }

    const HandlerModalExit = (e) => {
        e.preventDefault()
        setOpenModal(false)
        return () => {}
    }
    return (
        <div className="modal-container-1b">
            <div className="modal-content-1b">
                <p className="facility-name-1b">{location.facility}</p>
                <p className="facility-room-1b">Room: {location.room}</p>
                <div className="site-image-container-1b" style={{backgroundImage:`url(${ImageSrc})`}}>
                    {/* <img src={ImageSrc} alt="" className="site-image-1b" /> */}
                </div>
                <button className="modal-exit-1b" onClick={HandlerModalExit}>Close</button>
            </div>
        </div>
    )
}
