const { getPastNMinutes, getTwoMinuteAvg } = require("./app-actions-load-data");

module.exports = getAlertsFromLoadData;

function getAlertsFromLoadData(state, action, newLoadData) {
  const prevTwoMinuteAvg = getTwoMinuteAvg(state.loadData);
  const twoMinuteAvg = getTwoMinuteAvg(newLoadData);

  const wasInAlertMode = isLoadavgAvgHigh(state, action, prevTwoMinuteAvg);
  const isInAlertMode = isLoadavgAvgHigh(state, action, twoMinuteAvg);

  let { alerts } = state;
  let newAlert = null;

  if (!wasInAlertMode && isInAlertMode) {
    newAlert = createWarningAlert(state, action, { twoMinuteAvg });
  }

  if (wasInAlertMode && !isInAlertMode) {
    newAlert = createResolvedAlert(state, action, { twoMinuteAvg })
  }

  if (newAlert) {
    alerts = addAlert(state, action, newAlert);
    alerts = trimAlerts(state, action, alerts);
  }

  return alerts;
}

function trimAlerts(state, action, alerts) {
  const { maxAlertHistory } = state;
  return alerts.slice(0, maxAlertHistory);
}

function addAlert(state, action, alert) {
  const { alerts } = state;
  return [ alert, ...alerts ];
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

function isLoadavgAvgHigh(state, action, loadavgAvg) {
  const threshold = state.loadAlertThreshold;
  if (loadavgAvg > threshold) {
    return true;
  }
  return false;
}