import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {MapContainer, Marker, Circle, Popup, TileLayer, useMap, ZoomControl, useMapEvents} from "react-leaflet";
import BikeMarkers from "./BikeMarkers.jsx";
import Flexzones from "./Flexzones.jsx";
import {forEach} from "react-bootstrap/ElementChildren";


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
        drawBikes: (lats, lons) => {
            for(let i = 0; i < lats.length; i++) {
                map.drawMarker([lats[i], lons[i]], map.getZoom());
            }

        },
    }));

    return null;
});

const BikeMap = forwardRef(({mapSearchPos, setSearchPos, placingMode, setPlacingMode, radius, bikePositions, showBikes, showFlexzones, staticInfos}, ref) => {

    const orangeIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png', // orange color hex: #FFA500
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

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
#

            <Marker position={[mapSearchPos.lat, mapSearchPos.lon]} icon={orangeIcon} zIndexOffset={1000}>
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
                zIndexOffset={-1000}
            />

            {showBikes && <BikeMarkers bikePositions={bikePositions} />}

            {showFlexzones && <Flexzones staticInfos={staticInfos} />}

            <ZoomControl position="bottomright" />

        </MapContainer>
    );
});

export default BikeMap;

