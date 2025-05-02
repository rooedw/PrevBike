import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const LocationComponent = forwardRef((props, ref) => {
    const [position, setPosition] = useState(null);

    useImperativeHandle(ref, () => ({
        getPosition: () => position,
    }));

    useEffect(() => {
        if (!navigator.geolocation) {
            setPosition(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
            },
            (err) => {
                setPosition(null);
            }
        );
    }, []);



    if (!position) {
        return <div>Position wird geladen...</div>;
    }

    return (
        <div>
        </div>
    );
});

export default LocationComponent;
