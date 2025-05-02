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


function App() {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedCity, setSelectedCity] = useState({lat: 49.0087159, lon: 8.403911516})

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
                            <Form.Label>Suchradius (m)</Form.Label>
                            <Form.Range min={0} max={500} defaultValue={150} />
                            <Button variant="secondary" className="mt-2">Suchpositionsmarker platzieren</Button>
                        </Form.Group>

                        <Form.Group className="mb-3 p-2" style={{border: '2px solid darkgray'}}>
                            <Form.Label
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                aria-controls="advanced-options"
                                aria-expanded={showAdvanced}
                                style={{ cursor: 'pointer', display: 'block', fontWeight: 'bold' }}
                            >
                                Erweiterte Optionen {showAdvanced ? '▲' : '▼'}
                            </Form.Label>
                            <Collapse in={showAdvanced}>
                                <div id="advanced-options">
                                    <Form.Label>Position</Form.Label>
                                    <InputGroup className="mb-2 ">
                                        <InputGroup.Text>Lat</InputGroup.Text>
                                        <Form.Control type="text" defaultValue="49.123456"/>
                                    </InputGroup>

                                    <InputGroup className="mb-3 ">
                                        <InputGroup.Text>Lon</InputGroup.Text>
                                        <Form.Control type="text" defaultValue="8.123456"/>
                                    </InputGroup>

                                    <Form.Label>Betrachtungszeitraum</Form.Label>
                                    <InputGroup className="mb-3 ">
                                        <Form.Control type="number" defaultValue={2}/>
                                        <InputGroup.Text>Wochen</InputGroup.Text>
                                    </InputGroup>

                                        <Form.Label>Zeitrahmen (+/-)</Form.Label>
                                        <InputGroup className="mb-3 ">
                                            <Form.Control type="number" defaultValue={30}
                                                          className="short-input-smaller"/>
                                            <InputGroup.Text>Min</InputGroup.Text>
                                        </InputGroup>

                                        <Form.Check type="checkbox" label="Modus: selber Wochentag" defaultChecked/>
                                    </div>
                            </Collapse>
                        </Form.Group>


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

                    <BikeMap mapSelectedCity={selectedCity}></BikeMap>
                </Col>
            </Row>
        </Container>
    );
}

export default App
