import React, { useEffect, useState } from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl} from "react-leaflet";

const BikeMap = ({mapSelectedCity}) => {
    const [lastJumpPos, setLastJumpPos] = useState({lat: 0, lon: 0})

    function ChangeMapView() {
        const map = useMap()
        useEffect(() => {
            console.log(mapSelectedCity)
            map.setView([mapSelectedCity.lat, mapSelectedCity.lon], map.getZoom())
        }, [mapSelectedCity])
        return null
    }

    return (
        <MapContainer
            center={[mapSelectedCity.lat, mapSelectedCity.lon]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[mapSelectedCity.lat, mapSelectedCity.lon]}>
                <Popup>Bike 1234</Popup>
            </Marker>

            <ZoomControl position="bottomright" />
            <ChangeMapView />

        </MapContainer>
    );
};

export default BikeMap;

