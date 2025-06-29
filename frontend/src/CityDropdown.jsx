import {Form} from "react-bootstrap";
import React, { useEffect, useState } from 'react';

const CityDropdown = ({handleJump, staticInfos}) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (!staticInfos) {
            return;
        }
        const sortedCities = staticInfos.cities.sort((a, b) =>
            a.cityName.trim().localeCompare(b.cityName.trim())
        )
        setCities(sortedCities)
        if (sortedCities.length > 0) {
            console.log("calling handlejump")
            handleJump(sortedCities[0])
        }
    }, [staticInfos]);

    const handleCityChange = (e) => {
        const selectedCityId = parseInt(e.target.value)
        const selectedCity = cities.find((c) => c.townId === selectedCityId)
        if (selectedCity) handleJump(selectedCity)
        console.log('selected city:', selectedCity)
    }

    return (
        <Form.Group className="mb-2">
            <Form.Label>Stadt</Form.Label>
            <Form.Control as="select" onChange={handleCityChange}>
            {cities.map((city) => (
                <option key={city.townId} value={city.townId}>
                    {city.cityName.trim()}
                </option>
            ))}
            </Form.Control>
        </Form.Group>
    );
};

export default CityDropdown;