import {forwardRef, useImperativeHandle, useState} from 'react';
import moment from 'moment';
import 'moment/locale/de';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import "./SearchTimePicker.css";


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

    return (
        <div>
            <Datetime value={datetime} onChange={setDatetime} dateFormat="DD.MM.YYYY" timeFormat="HH:mm" locale="de"/>
        </div>
    );
});

export default SearchTimePicker;
