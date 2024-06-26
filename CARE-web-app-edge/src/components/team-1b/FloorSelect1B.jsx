import React, { useContext } from 'react'
import { NECFloorContext } from '../../pages/Team1B'

export default function FloorSelect1B() {
    const {floor, setFloor, location, setLocation, openModal, setOpenModal} = useContext(NECFloorContext)

    const floorChangeHandler = (e) => {
        const newFloor = e.target.value;
        e.preventDefault();
        setFloor(newFloor)
        console.log(newFloor)
    }

    return (
        <select name="nec-floor" className='floor-select-1b' onChange={floorChangeHandler}>
            <option value={0}>1st Floor</option>
            <option value={1}>1st-2nd Floor Stairs</option>
            <option value={2}>2nd Floor</option>
            <option value={3}>3rd Floor</option>
            <option value={4}>4th Floor</option>
        </select>
    )
}
