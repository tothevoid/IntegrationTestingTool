export const formatDate = (date) => 
    addZeroes(date.getDate()) + "/" + addZeroes((date.getMonth() + 1)) + "/" + date.getFullYear() 
        + " " + addZeroes(date.getHours()) + ":" + addZeroes(date.getMinutes());

export const getCurrentDate = () => {
    const date = new Date();
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString().substr(0, 10);
}

const addZeroes = (value) => 
    (value <= 9) ?
        "0" + value :
        value;