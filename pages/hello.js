import React, { useState, useEffect } from 'react';
import { getCurrentTime } from '../src/utils/momentSystemDynamic';

export default function Hello() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p style={{marginLeft: 15}}>Welcome to Ultige Web! Today is {currentTime.format()}</p>
    </>
  );
}
