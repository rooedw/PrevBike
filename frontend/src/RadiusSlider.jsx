import {useState, forwardRef, useImperativeHandle} from 'react';
import { Form } from 'react-bootstrap';

const RadiusSlider = ({ radius, setRadius }) => {
    const min = 20;
    const max = 500;

    return (
        <Form.Group className="mb-2">
            <Form.Label>Suchradius (m): {radius}</Form.Label>

            <div className="d-flex align-items-center">
                <small className="me-1" style={{ width: '60px', textAlign: 'right' }}>{min} m</small>

                <Form.Range
                    min={min}
                    max={max}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="flex-grow-1 mx-2"
                />

                <small className="ms-1" style={{ width: '80px' }}>{max} m</small>
            </div>
        </Form.Group>
    );
};

export default RadiusSlider;
