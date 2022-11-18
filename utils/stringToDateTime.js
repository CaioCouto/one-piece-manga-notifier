const months = require("./months");

function stringToDateTime(dateStr) {
    const dateArray = dateStr.split(' de ').reverse();
    dateArray[1] = (months.indexOf(dateArray[1])+1).toString();
    return new Date(dateArray.join('-'));
}

module.exports = stringToDateTime;