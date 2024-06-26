import React from 'react'
import logo from '../assets/upcare.webp';

export default function CareLoader() {
  return (
    <div className="care-loader">
        <img src={logo} alt="" className='care-loader-img'/>
    </div>
  )
}
