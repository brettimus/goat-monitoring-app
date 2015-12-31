const initialState = {
  twoMinuteAvg: null,
  loadData: [],
  alerts: [],
  loadInterval: 10000, // ms (show data in 10 second intervals)
  loadSpan: 10 * 60 * 1000, // ms (show 10 mins of data)
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LOAD_DATUM": return addLoadDatum(state, action);
    default              : return state;
  }
};

module.exports = reducer;

function addLoadDatum(state, action) {
  const oldLoadData = state.loadData;
  const newLoadDatum = action.loadDatum;
  const loadData = [...oldLoadData, newLoadDatum];
  const twoMinuteAvg = getTwoMinuteAvg(loadData);
  return { ...state, loadData, twoMinuteAvg };
}

function getTwoMinuteAvg(loadData) {
  const twoMinutes = 60 * 2;
  const loadavgs = loadData.slice(0, twoMinutes).map( ({y}) => y )
  return average(loadavgs);
}

function average(numbers) {
  if (numbers.length === 0) return null;

  return numbers.reduceRight(function(result, d, i, array) {
    const sum = result + d;
    if (i === 0) return sum / array.length;
    return sum;
  }, 0)
}