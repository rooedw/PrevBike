import React, { useEffect, useState } from 'react';

const LocationComponent = () => {
    const [position, setPosition] = useState(null);

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
            <p>Breitengrad: {position.lat}</p>
            <p>Längengrad: {position.lon}</p>
        </div>
    );
};

export default LocationComponent;
