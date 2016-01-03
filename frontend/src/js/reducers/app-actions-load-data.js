const { average } = require("../utils");

module.exports = {
    getPastNMinutes,
    getTwoMinuteAvg
};

function getPastNMinutes(loadData, n = 10) {
    return loadData.slice(0, n);   
}

function getTwoMinuteAvg(loadData) {
  const loadavgs = getPastNMinutes(loadData, 2).map( ({loadavg}) => loadavg );
  return average(loadavgs);
}