import React, { useEffect } from 'react';

const Catalog = () => {
  useEffect(() => {
    window.location.assign("https://catalogs.howelandco.co", '_blank');
  }, []);

  return <React.Fragment/>;
}

export default Catalog;