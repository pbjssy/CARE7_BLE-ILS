import React, { useContext } from 'react'
import { PUBMapContext } from '../../pages/Team1H';


export default function MapSelect1H() {
    const {env, setEnv} = useContext(PUBMapContext)

    const mapChangeHandler = (e) => {
        const newMap = e.target.value;
        e.preventDefault();
        setEnv(newMap)
        console.log(newMap)
    }
    return (
        <select name="pub-map" className='floor-select-1b' onChange={mapChangeHandler}>
            <option value={0}>Indoor Air Quality</option>
            <option value={1}>Outdoor Air Quality</option>
        </select>
    )
}
