const initialState = require("./app-state-initial");

const { 
  addLoadDatum, 
  bufferChartData, 
  flushBuffer,
  recordChartUpdate,
  toggleTheme } = require("./app-actions");

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LOAD_DATUM"     : return addLoadDatum(state, action);
    case "BUFFER_CHART_DATA"  : return bufferChartData(state, action);
    case "FLUSH_BUFFER"       : return flushBuffer(state, action);
    case "RECORD_CHART_UPDATE": return recordChartUpdate(state, action);
    case "TOGGLE_THEME"       : return toggleTheme(state, action);
    default                   : return state;
  }
};

module.exports = reducer;