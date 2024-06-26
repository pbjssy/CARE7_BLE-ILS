import React, { useContext, useEffect, useState } from 'react'
import { NECNodeContext } from '../../pages/Team1B'

export default function SensorNode1B({nodeId, nodeNumber, withWind, type, facility, angleOffset=0}) {
    const [nodeDetails, setNodeDetails] = useContext(NECNodeContext);
    const [angle, setAngle] = useState(angleOffset);
    const nodeOnClickHandler = () => {
        setNodeDetails({
            node: nodeNumber,
            facility: facility,
            type: type,
            withWind: withWind
        })
    }


    const getWindDirection = async () => {
        try {
            const options = {method: 'GET', headers: {accept: 'application/json'}};
            const payload = await fetch(`https://sync.upcare.ph/api/measurement/EEE199_NEC/latest?source=${nodeNumber}&type=WDIR`, options);
            const data = await payload.json();
            setAngle(data[0].value);
        } catch (e) {

        }
        
    }
    
    if (withWind) {
        setInterval(getWindDirection, 15000);
    }
    

    useEffect(() => {
        if (withWind) {
            getWindDirection();
        }
    });
    
    return (
        <div className={withWind ? "anem-1b" : "node-1b"} id={nodeId} onClick={nodeOnClickHandler} style={{transform: withWind ? `rotate(${angle + angleOffset}deg)` : `rotate(${0})deg`}}>{withWind ? "<" : nodeNumber}</div>
    )
}
