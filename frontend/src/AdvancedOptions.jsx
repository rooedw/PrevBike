import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Collapse, Form, InputGroup} from "react-bootstrap";
import LatLongInput from "./LatLongInput.jsx";

const AdvancedOptions = forwardRef(({searchPos, setSearchPos}, ref) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [weekRange, setWeekRange] = useState(14);
    const [halfMinuteRange, setHalfMinuteRange] = useState(30);
    const [modeWeekday, setModeWeekday] = useState("SAME_DAY_TYPE");

    useImperativeHandle(ref, () => ({
        getWeekRange: () => weekRange,
        getHalfMinuteRange: () => halfMinuteRange,
        getModeWeekday: () => modeWeekday,
    }));

    const forcePositiveInteger = (setter) => (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val) && Number(val) > 0) {
            setter(val);
        }
    };


    return (
        <Form.Group className="mb-3 mt-3 p-2" style={{border: '2px solid darkgray'}}>
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
                        <Form.Control type="number" value={weekRange} onChange={forcePositiveInteger(setWeekRange)}/>
                        <InputGroup.Text>Wochen</InputGroup.Text>
                    </InputGroup>

                    <Form.Label>Zeitrahmen (+/-)</Form.Label>
                    <InputGroup className="mb-3 ">
                        <Form.Control type="number" value={halfMinuteRange} onChange={forcePositiveInteger(setHalfMinuteRange)}/>
                        <InputGroup.Text>Min</InputGroup.Text>
                    </InputGroup>

                    <Form.Group controlId="modeSelect">
                        <Form.Label>Modus</Form.Label>
                        <Form.Select value={modeWeekday} onChange={(e) => setModeWeekday(e.target.value)}>
                            <option value="SAME_WEEKDAY">Selber Wochentag</option>
                            <option value="SAME_DAY_TYPE">Mo-Fr vs. Sa-So</option>
                            <option value="ALL">Alle Tage</option>
                        </Form.Select>
                    </Form.Group>
                </div>
            </Collapse>
        </Form.Group>
    );
});

export default AdvancedOptions;