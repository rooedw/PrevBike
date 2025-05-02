import React, {useState} from 'react';
import {Collapse, Form, InputGroup} from "react-bootstrap";
import LatLongInput from "./LatLongInput.jsx";

function AdvancedOptions ({searchPos, setSearchPos}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
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
                    <LatLongInput searchPos={searchPos} setSearchPos={setSearchPos} />

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
    );
}

export default AdvancedOptions;