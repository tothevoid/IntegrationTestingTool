export const formatDate = (date) => 
    addZeroes(date.getDate()) + "/" + addZeroes((date.getMonth() + 1)) + "/" + date.getFullYear() 
        + " " + addZeroes(date.getHours()) + ":" + addZeroes(date.getMinutes());

const addZeroes = (value) => 
    (value <= 9) ?
        "0" + value :
        value;