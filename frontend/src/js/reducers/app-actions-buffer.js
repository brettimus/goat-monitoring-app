const { head, tail } = require("../utils");

module.exports = { appendNewColumnData };

function appendNewColumnData(chartDataBuffer, col) {
  let name = head(col);
  if (!(name in chartDataBuffer)) {
    chartDataBuffer[name] = [name];
  }
  let prevBuffer = chartDataBuffer[name];
  chartDataBuffer[name] = [...prevBuffer, ...tail(col)];
  return chartDataBuffer;
}