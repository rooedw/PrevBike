import {useEffect, useRef, useState} from 'react'
import prevBikeLogo from './assets/prevbike_logo_landscape.png'
import React from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './App.css'
import CityDropdown from "./CityDropdown.jsx";
import BikeMap from "./BikeMap.jsx";
import AdvancedOptions from "./AdvancedOptions.jsx";
import SearchTimePicker from "./SearchTimePicker.jsx";
import RadiusSlider from "./RadiusSlider.jsx";
import LocationComponent from "./LocationComponent.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';



function App() {
    const locationRef = useRef();
    const mapRef = useRef();
    const radiusSliderRef = useRef();
    const searchTimePickerRef = useRef();
    const advancedOptionsRef = useRef();
    const [searchPos, setSearchPos] = useState({lat: 49.0087159, lon: 8.403911516})
    const [placingMode, setPlacingMode] = useState(false);
    const [bikeProbability, setBikeProbability] = useState(0.0);

    // set search pos to current position
    const handleSetSearchPos = () => {
        const pos = locationRef.current?.getPosition();
        if (pos) {
            setSearchPos(pos);
            handleJump(pos);
        }
    };

    // handle jump of map
    const handleJump = ({lat, lon}) => {
        console.log("called handleJump in app", lat, lon);
        console.log(mapRef);
        mapRef.current?.jump(lat, lon);
    };

    const handleSearch = async () => {
        // probability?lat=49.011223016021454&lon=8.416850309144804&radius=500.0&weekRange=5&halfMinuteRange=30&requestModeString=ALL&requestTimestampString=2025-03-15T16:20:00
        const radius = radiusSliderRef.current.getRadius();
        const datetimeString = searchTimePickerRef.current.getDatetime().toISOString().slice(0, 19);
        const weekRange = advancedOptionsRef.current.getWeekRange();
        const halfMinuteRange = advancedOptionsRef.current.getHalfMinuteRange();
        const requestModeString = advancedOptionsRef.current.getModeWeekday();
        const response = await fetch(`http://localhost:8080/bikeapi/probability?lat=${searchPos.lat}&lon=${searchPos.lon}&radius=${radius}&weekRange=${weekRange}&halfMinuteRange=${halfMinuteRange}&requestModeString=${requestModeString}&requestTimestampString=${datetimeString}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data); // Success — do something with `data`
            setBikeProbability(data);
        } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex flex-column">
            <Row className="flex-grow-1">
                {/* Sidebar */}
                <Col md={2} className="p-3" style={{ backgroundColor: '#FFDCB9', color: 'black' }}>
                    <Form>
                        <CityDropdown handleJump={handleJump}></CityDropdown>

                        <Form.Group className="mb-3">
                            <Form.Label>Zeitpunkt</Form.Label>
                            <SearchTimePicker ref={searchTimePickerRef} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <RadiusSlider ref={radiusSliderRef}/>
                            <Button variant={placingMode ? "danger" : "light"} className="mt-2" onClick={() => setPlacingMode(!placingMode)}>
                                {placingMode ? "Klick auf die Karte..." : "Suchpositionsmarker platzieren"}
                            </Button>
                            <Button onClick={handleSetSearchPos} className="mt-2 ms-1">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </Button>
                        </Form.Group>

                        <AdvancedOptions ref={advancedOptionsRef} searchPos={searchPos} setSearchPos={setSearchPos}/>
                        <LocationComponent ref={locationRef}/>

                        <Button variant="light" className="mb-3">Suche speichern</Button>
                        <Button variant="light" className="mb-3">Suche laden</Button>
                        <Button variant="primary" className="mb-3" onClick={handleSearch}>Suche starten</Button>

                        <div className="bg-light text-dark p-2">
                            Wahrscheinlichkeit für Zeitraum x - y: <strong>{bikeProbability*100}%</strong>
                        </div>

                        <Form.Check type="checkbox" label="nextbikes anzeigen" defaultChecked className="mt-2" />
                        <Form.Check type="checkbox" label="Rückgabebereich anzeigen" defaultChecked />
                    </Form>
                </Col>

                {/* Main View */}
                <Col md={10} className="p-0 position-relative">
                    <div className="rounded-header d-flex justify-content-between align-items-center px-4">
                        <Button variant="light" size="sm">🌐 DE</Button>

                        <img
                            src={prevBikeLogo}
                            alt="PrevBike Logo"
                            className="logo-center"
                        />

                        <Button variant="light" size="sm">ℹ️ Impressum</Button>
                    </div>

                    <BikeMap ref={mapRef} mapSearchPos={searchPos} setSearchPos={setSearchPos} placingMode={placingMode} setPlacingMode={setPlacingMode}></BikeMap>
                </Col>
            </Row>
        </Container>
    );
}

export default App
