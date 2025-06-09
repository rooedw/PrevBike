import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {MapContainer, Marker, Circle, Popup, TileLayer, useMap, ZoomControl, useMapEvents} from "react-leaflet";


function ClickHandler({ placingMode, setPlacingMode, setSearchPos }) {
    useMapEvents({
        click(e) {
            if (placingMode) {
                setSearchPos({lat: e.latlng.lat, lon: e.latlng.lng});
                setPlacingMode(false); // exit placing mode
            }
        },
    });
    return null;
}

const MapController = forwardRef((props, ref) => {
    const map = useMap();

    useImperativeHandle(ref, () => ({
        jump: (lat, lon) => {
            console.log("Jumping to", lat, lon);
            map.setView([lat, lon], map.getZoom());
        },
    }));

    return null;
});

const BikeMap = forwardRef(({mapSearchPos, setSearchPos, placingMode, setPlacingMode, radius}, ref) => {

    return (
        <MapContainer
            center={[49.0087159, 8.403911516]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <MapController ref={ref} />
            <ClickHandler placingMode={placingMode} setPlacingMode={setPlacingMode} setSearchPos={setSearchPos} />

            <Marker position={[mapSearchPos.lat, mapSearchPos.lon]}>
                <Popup>SearchPos</Popup>
            </Marker>

            <Circle
                center={[mapSearchPos.lat, mapSearchPos.lon]}
                radius={radius} // in meters
                pathOptions={{
                    color: 'orange',
                    fillColor: 'orange',
                    fillOpacity: 0.3,
                }}
            />

            <ZoomControl position="bottomright" />

        </MapContainer>
    );
});

export default BikeMap;

