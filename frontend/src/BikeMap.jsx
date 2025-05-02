import React, { useEffect, useState } from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl, useMapEvents} from "react-leaflet";


function ClickHandler({ placingMode, setPlacingMode, setSearchPos }) {
    useMapEvents({
        click(e) {
            console.log(e);
            if (placingMode) {
                setSearchPos({lat: e.latlng.lat, lon: e.latlng.lng});
                setPlacingMode(false); // exit placing mode
            }
        },
    });
    return null;
}

const BikeMap = ({mapSelectedCity, mapSearchPos, setSearchPos, placingMode, setPlacingMode}) => {
    const [lastJumpPos, setLastJumpPos] = useState({lat: 0, lon: 0})

    function ChangeMapView() {
        const map = useMap()
        useEffect(() => {
            if (lastJumpPos.lat !== mapSelectedCity.lat || lastJumpPos.lon !== mapSelectedCity.lon) {
                console.log(mapSelectedCity)
                map.setView([mapSelectedCity.lat, mapSelectedCity.lon], map.getZoom())
                setLastJumpPos({lat: mapSelectedCity.lat, lon: mapSelectedCity.lon})
            }
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

            <ClickHandler placingMode={placingMode} setPlacingMode={setPlacingMode} setSearchPos={setSearchPos} />

            <Marker position={[mapSelectedCity.lat, mapSelectedCity.lon]}>
                <Popup>Bike 1234</Popup>
            </Marker>
            <Marker position={[mapSearchPos.lat, mapSearchPos.lon]}>
                <Popup>SearchPos</Popup>
            </Marker>

            <ZoomControl position="bottomright" />
            <ChangeMapView />

        </MapContainer>
    );
};

export default BikeMap;

