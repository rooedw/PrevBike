import {Form, InputGroup} from "react-bootstrap";
import React, {useEffect, useState} from "react";


function LatLongInput({searchPos, setSearchPos}) {
    const [latInput, setLatInput] = useState(String(searchPos.lat ?? ''));
    const [lonInput, setLonInput] = useState(String(searchPos.lon ?? ''));

    useEffect(() => {
        setLatInput(String(searchPos.lat ?? ''));
        setLonInput(String(searchPos.lon ?? ''));
    }, [searchPos]);

    function isValidLatLon(latlon, isLat) {
        // Allow only digits, one optional decimal point, and optional minus
        if (!(/^-?\d*\.?\d*$/.test(latlon) && latlon !== '')) return false;
        const number = parseFloat(latlon);
        if ( isLat && Math.abs(number) > 90)  return false;
        if (!isLat && Math.abs(number) > 180) return false;
        return true;
    }

    return (
        <>
            <InputGroup className="mb-2 ">
                <InputGroup.Text>Lat</InputGroup.Text>
                <Form.Control type="number" step="0.0005" value={latInput} onChange={
                    (e) => {
                        const val = e.target.value;
                        setLatInput(val);
                        if (isValidLatLon(val, true)){
                            setSearchPos({ ...searchPos, lat: parseFloat(val) })
                        }
                    }
                }/>
            </InputGroup>
            <InputGroup className="mb-3 ">
                <InputGroup.Text>Lon</InputGroup.Text>
                <Form.Control type="number" step="0.0005" value={lonInput} onChange={
                    (e) => {
                        const val = e.target.value;
                        setLonInput(val);
                        if (isValidLatLon(val, false)){
                            setSearchPos({ ...searchPos, lon: parseFloat(val) })
                        }
                    }
                }/>
            </InputGroup>
        </>
    );
}


export default LatLongInput;