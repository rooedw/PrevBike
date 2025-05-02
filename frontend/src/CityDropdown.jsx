import {Form} from "react-bootstrap";
import React, { useEffect, useState } from 'react';

const CityDropdown = ({handleJump}) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetch('/static_infos.json')
            .then((res) => res.json())
            .then((data) => {
                const sortedCities = data.cities.sort((a, b) =>
                    a.cityName.trim().localeCompare(b.cityName.trim())
                )
                setCities(sortedCities)
                if (sortedCities.length > 0) {
                    console.log("calling handlejump")
                    handleJump(sortedCities[0])
                }
            })
            .catch((err) => console.error('Error loading cities:', err));
    }, []);

    const handleCityChange = (e) => {
        const selectedCityId = parseInt(e.target.value)
        const selectedCity = cities.find((c) => c.townId === selectedCityId)
        if (selectedCity) handleJump(selectedCity)
        console.log('selected city:', selectedCity)
    }

    return (
        <Form.Group className="mb-3">
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