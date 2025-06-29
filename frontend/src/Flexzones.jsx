import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";



function Flexzones({ staticInfos }) {
    const map = useMap();
    const zoneCategory2Color = {
        'active_ebike_zone': "#0000FF",
        'slow_go_zone': "#00FF00",
        'chargeable_return': "#fd822c",
        'business_area': "#FF00FF",
        'free_return': "#00FFFF",
        'force_chargeable_return': "#FFFF00",
        }
        //'active_ebike_zone', 'slow_go_zone', 'chargeable_return', 'business_area', 'free_return', 'force_chargeable_return'}
    useEffect(() => {
        if (!map || !staticInfos) {
            return;
        }
        const zones = staticInfos.flexzones;
        if (!zones) {
            return;
        }

        const layerGroup = L.layerGroup();
        zones.forEach((zoneRegion) => {
            zoneRegion.zones.forEach((coords) => {
                const category = coords.category;
                let isFirst = true;

                const allRings = coords.coordinates.map(realCoords =>
                    realCoords.map(([lng, lat]) => [lat, lng])
                );

                const polygon = L.polygon([allRings[0], ...allRings.slice(1)], {
                    color: "black",
                    weight: 2,
                    fillColor: zoneCategory2Color[category],
                    fillOpacity: 0.6//0.3
                }).bindPopup(`Zone: ` + zoneRegion.regionName + "<br>Category: " + category);

                layerGroup.addLayer(polygon);
/*
                coords.coordinates.forEach((realCoords) => {
                    //console.log(realCoords);
                    const polygon = L.polygon(realCoords.map(([lng, lat]) => [lat, lng]), {
                        color: "black",
                        weight: 2,
                        fillColor: zoneCategory2Color[category],
                        fillOpacity: 0.6//0.3
                    }).bindPopup(`Zone: ` + zoneRegion.regionName + "<br>Category: " + category);

                    layerGroup.addLayer(polygon);
                    isFirst = false;
                })*/

            });
        });

        layerGroup.addTo(map);

        return () => {
            map.removeLayer(layerGroup);
        };
    }, [staticInfos, map]);

    return null;
}

export default Flexzones;
