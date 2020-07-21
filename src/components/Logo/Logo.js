import React from "react";
import Tilt from 'react-tilt'


import brain from './brain.png'
import './Logo.css';

const Logo = () => {
  return (
      
    <div className='ma2 mt0'>
        <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 250, width: 250 }} >
            <div className="Tilt-inner pa5"> <img src={brain} alt='LOGO' /> </div>
        </Tilt>     
    </div>
  );
};
export default Logo;
