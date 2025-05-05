import {useRef, useState} from 'react'
import prevBikeLogo from './assets/prevbike_logo_landscape.png'
import React from 'react';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
            setLoading(false);
        } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
            setLoading(false);
        }
    };


    return (
        <Container fluid className="vh-100 d-flex flex-column app-container">
            {/* Header — always at top of page */}
            <div className="app-header d-flex justify-content-between align-items-center px-4">
                <Button variant="light" size="sm">🌐 DE</Button>
                <img src={prevBikeLogo} alt="PrevBike Logo" className="logo-center" />
                <Button variant="light" size="sm">ℹ️ Impressum</Button>
            </div>
            <div className="flex-grow-1 d-flex flex-md-row flex-column overflow-hidden">
                {/* Sidebar / Einstellungen */}
                <div className="settings-container p-3 pt-1">
                    <Form className="settings-form">
                        <CityDropdown handleJump={handleJump}></CityDropdown>

                        <Form.Group className="mb-3">
                            <Form.Label>Zeitpunkt</Form.Label>
                            <SearchTimePicker ref={searchTimePickerRef} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <RadiusSlider ref={radiusSliderRef}/>
                            <Button variant={placingMode ? "danger" : "light"} className="position-button" onClick={() => setPlacingMode(!placingMode)}>
                                {placingMode ? "Klick auf die Karte..." : "Position setzen"}
                            </Button>
                            <Button onClick={handleSetSearchPos} className="ms-2">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </Button>
                        </Form.Group>

                        <LocationComponent ref={locationRef}/>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="flex-grow-1 me-2">
                                <Button variant="primary" className="w-100" onClick={handleSearch}>Suche starten</Button>
                            </div>

                            <div
                                className="bg-light text-dark p-1 border rounded"
                                style={{ minWidth: '160px', textAlign: 'center' }}
                            >
                                <div style={{ fontSize: '0.9rem' }}>Wahrscheinlichkeit:</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {loading ? (
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                    ): Math.round(bikeProbability * 100)} %

                                </div>
                            </div>
                        </div>


                        <Button variant="light" className="mb-3">Suche speichern</Button>
                        <Button variant="light" className="mb-3">Suche laden</Button>



                        <Form.Check type="checkbox" label="nextbikes anzeigen" defaultChecked className="mt-2" />
                        <Form.Check type="checkbox" label="Rückgabebereich anzeigen" defaultChecked />

                        <AdvancedOptions ref={advancedOptionsRef} searchPos={searchPos} setSearchPos={setSearchPos}/>

                    </Form>
                </div>

                {/* Karte */}
                <div className="map-container position-relative">

                    <BikeMap
                        ref={mapRef}
                        mapSearchPos={searchPos}
                        setSearchPos={setSearchPos}
                        placingMode={placingMode}
                        setPlacingMode={setPlacingMode}
                    />
                </div>
            </div>
        </Container>
    );
}

export default App
