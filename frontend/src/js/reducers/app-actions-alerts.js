const { getTwoMinuteLoadavg } = require("./app-actions-load-data");

module.exports = getAlertsFromLoadData;

function getAlertsFromLoadData(state, action, newLoadData) {
  let { alerts } = state;

  const twoMinuteAvg = getTwoMinuteLoadavg(state, action, newLoadData);

  if (twoMinuteAvg === "NA") return alerts;

  const wasInWarningMode = wasLastAlertWarning(state, action);
  const isInWarningMode = isLoadavgAvgHigh(state, action, twoMinuteAvg);

  let newAlert = null;

  if (!wasInWarningMode && isInWarningMode) {
    newAlert = createWarningAlert(state, action, { twoMinuteAvg });
  }

  if (wasInWarningMode && !isInWarningMode) {
    newAlert = createResolvedAlert(state, action, { twoMinuteAvg })
  }

  if (newAlert) {
    alerts = addAlert(state, action, newAlert);
    alerts = trimAlerts(state, action, alerts);
  }

  return alerts;
}

function createResolvedAlert(state, action, { twoMinuteAvg }) {
  let { timestamp } = action.loadDatum;
  return {
    type: "success",
    message: "High {theme} recovered",
    twoMinuteAvg,
    timestamp,
  };
}

function createWarningAlert(state, action, { twoMinuteAvg }) {
  let { timestamp } = action.loadDatum;
  return {
    type: "warning",
    message: "High {theme} generated an alert",
    twoMinuteAvg,
    timestamp,
  };
}

function wasLastAlertWarning(state, action) {
  let { alerts } = state;
  let lastAlert = latest(alerts);
  return lastAlert && isWarning(lastAlert);
}

function isLoadavgAvgHigh(state, action, loadavg) {
  const threshold = state.loadAlertThreshold;
  if (loadavg > threshold) {
    return true;
  }
  return false;
}

function addAlert(state, action, alert) {
  const { alerts } = state;
  return [ alert, ...alerts ];
}

function trimAlerts(state, action, alerts) {
  const { maxAlertHistory } = state;
  return alerts.slice(0, maxAlertHistory);
}

function isWarning(alert) {
  return alert.type === "warning";
}

function latest(alerts) {
  return alerts[0];
}
