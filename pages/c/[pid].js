import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

const CatalogRedirect = () => {
    const router = useRouter()
    const { pid } = router.query;

    useEffect(() => {
        if (pid != undefined) {
            window.location = "https://ultige.s3.ap-southeast-1.amazonaws.com/catalog/" + atob(pid) + ".pdf";
        }
    }, [pid]);

    return <React.Fragment/>
};

export default CatalogRedirect;
