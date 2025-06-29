import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "./BikeMarkers.css";

const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();

    return L.divIcon({
        html: `<div class="custom-cluster-icon">${count}</div>`,
        className: 'custom-cluster-wrapper',
        iconSize: L.point(40, 40, true),
    });
};

function BikeMarkers ({ bikePositions }) {
    const map = useMap();




    useEffect(() => {
        if (!map) return;

        const clusterGroup = L.markerClusterGroup({
            iconCreateFunction: createClusterCustomIcon,
            maxClusterRadius: (zoom) => {
                if (zoom >= 17) {
                    return 5;
                }
                return 50;
            }
        });

        bikePositions.forEach((pos, index) => {
            const marker = L.marker(pos).bindPopup(`Bike index: ${index + 1}`);
            clusterGroup.addLayer(marker);
        });

        map.addLayer(clusterGroup);

        return () => {
            map.removeLayer(clusterGroup);
        };
    }, [bikePositions, map]);



    return null;
}

export default BikeMarkers;
