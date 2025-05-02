import {useState, forwardRef, useImperativeHandle} from 'react';
import { Form } from 'react-bootstrap';

const RadiusSlider = forwardRef((props, ref) => {
    const [radius, setRadius] = useState(100);
    const min = 20;
    const max = 500;

    useImperativeHandle(ref, () => ({
        getRadius: () => radius,
    }));

    return (
        <Form.Group className="mb-3">
            <Form.Label>
                Suchradius (m): {radius}
            </Form.Label>

            <Form.Range
                min={min}
                max={max}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
            />

            <div className="d-flex justify-content-between">
                <small>{min} m</small>
                <small>{max} m</small>
            </div>

        </Form.Group>
    );
});

export default RadiusSlider;
