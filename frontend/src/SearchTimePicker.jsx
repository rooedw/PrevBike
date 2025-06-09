import React, {forwardRef, useImperativeHandle, useState} from 'react';
import moment from 'moment';
import 'moment/locale/de';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import "./SearchTimePicker.css";
import { toast } from 'react-toastify';


moment.locale('de');
moment.updateLocale('de', {
    week: {
        dow: 1
    }
});

const SearchTimePicker = forwardRef((props, ref) => {
    const [datetime, setDatetime] = useState(moment())

    useImperativeHandle(ref, () => ({
        getDatetime: () => datetime,
    }));

    // Validation function for disallowed dates/times
    const isValidDate = (current) => {
        return current.isSameOrAfter(moment().startOf("day"));
    };

    const handleBlur = () => {
        if (!datetime.isSameOrAfter(moment())) {
            toast.error("Die ausgewählte Zeit liegt in der Vergangenheit. Zeitpunkt wurde auf in 10 Minuten gesetzt!", {
                autoClose: 5000,
            });
            setDatetime(moment().add(10, "minutes"));
        }
    };

    return (
        <div>
            <Datetime value={datetime} onChange={setDatetime} dateFormat="DD.MM.YYYY" timeFormat="HH:mm" locale="de" isValidDate={isValidDate} onBlur={handleBlur} onClose={handleBlur}/>
        </div>
    );
});

export default SearchTimePicker;
