import React from 'react'
import Indoor1H from './Environment/Indoor1H';
import Outdoor1H from './Environment/Outdoor1H';



export default function EnvironmentContainer1H({Env}) {
    let button;

    if (Env == 0) {
        button = <Indoor1H />
    } else {
        button = <Outdoor1H />
    }

    return (     
        <>
            {button}
        </>
        
    )
}