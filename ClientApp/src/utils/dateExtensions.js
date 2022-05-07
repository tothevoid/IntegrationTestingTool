export const formatDate = (date) =>
    addZeroes(date.getDate()) + "/" + addZeroes((date.getMonth() + 1)) + "/" + date.getFullYear() 
        + " " + addZeroes(date.getHours()) + ":" + addZeroes(date.getMinutes());

export const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();
}

export const getIsoStringWithoutTime = (isoDate) =>
    isoDate.substr(0, 10);

export const setMaxTimeToDate = (date) => {
    //1000 ms * 60s * 60min - 1ms
    const maxTimeTicks = 60000 * 24 * 60 - 1
    const dateWithOffset = subtractOffsetFromDate(date, date.getTimezoneOffset());
    
    return new Date(dateWithOffset + maxTimeTicks).toISOString();
}

const subtractOffsetFromDate = (date, offset) =>
    date.getTime() + offset * 60000;

const addZeroes = (value) => 
    (value <= 9) ?
        "0" + value :
        value;