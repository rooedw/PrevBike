import {Marker, Popup} from "react-leaflet";

const BikeMarkers = ({ bikePositions }) => {



    return (
        <>
            {bikePositions.map((pos, index) => (
                <Marker key={index} position={pos}>
                    <Popup>Bike index:{index + 1}</Popup>
                </Marker>
            ))}
        </>
    );
};


export default BikeMarkers;