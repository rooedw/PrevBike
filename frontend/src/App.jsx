import {useEffect, useMemo, useState} from 'react'
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


function App() {
    const [selectedCity, setSelectedCity] = useState({lat: 49.0087159, lon: 8.403911516})
    const [searchPos, setSearchPos] = useState({lat: 49.0087159, lon: 8.403911516})
    const [placingMode, setPlacingMode] = useState(false);

    useEffect(() => {
        console.log("selectedCity changed")
    }, [selectedCity]);

    return (
        <Container fluid className="vh-100 d-flex flex-column">
            <Row className="flex-grow-1">
                {/* Sidebar */}
                <Col md={2} className="p-3" style={{ backgroundColor: '#FFDCB9', color: 'black' }}>
                    <Form>
                        <CityDropdown setSelectedCity={setSelectedCity}></CityDropdown>

                        <Form.Group className="mb-3">
                            <Form.Label>Zeitpunkt</Form.Label>
                            <SearchTimePicker  />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <RadiusSlider/>
                            <Button variant={placingMode ? "danger" : "light"} className="mt-2" onClick={() => setPlacingMode(!placingMode)}>
                                {placingMode ? "Klick auf die Karte..." : "Suchpositionsmarker platzieren"}
                            </Button>
                        </Form.Group>

                        <AdvancedOptions/>
                        <LocationComponent/>

                        <Button variant="light" className="mb-3">Suche speichern</Button>
                        <Button variant="light" className="mb-3">Suche laden</Button>
                        <Button variant="primary" className="mb-3">Suche starten</Button>

                        <div className="bg-light text-dark p-2">
                            Wahrscheinlichkeit für Zeitraum x - y: <strong>10%</strong>
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

                    <BikeMap mapSelectedCity={selectedCity} mapSearchPos={searchPos} setSearchPos={setSearchPos} placingMode={placingMode} setPlacingMode={setPlacingMode}></BikeMap>
                </Col>
            </Row>
        </Container>
    );
}

export default App
