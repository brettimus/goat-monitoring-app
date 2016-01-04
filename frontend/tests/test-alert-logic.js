const GOAT = "🐐";

require("colors"); // note: monkey-patches String.prototype
const expect = require("expect");
const deepFreeze = require("deep-freeze");

const nTimes = (n, f) => { while (n--) f() };
const printGoat = () => console.log(GOAT);
const getAlertsFromLoadData = require("../src/js/reducers/app-actions-alerts");

module.exports = function testAlertLogic() {
  crossingIntoHighThresholdAddsAlert();
  crossingIntoHighThresholdAddsWarningAlert();
  crossingIntoLowThresholdAddsAlert();
  crossingIntoLowThresholdAddsSuccessAlert();
  remainingInHighThresholdDoesNotAddAlert();
  remainingInLowThresholdDoesNotAddAlert();
  success();
}

function success() {
  nTimes(2, printGoat);
  console.log(GOAT, "  ", "Alert tests passed".green.underline);
  console.log(GOAT, "   You're good to goat, friend.".blue);
  nTimes(3, printGoat);
}

function crossingIntoHighThresholdAddsAlert() {
  let { state, action, nextLoadData } = getLowToHighMocks();
  let alerts = getAlertsFromLoadData(state, action, nextLoadData);
  expect(alerts.length).toEqual(state.alerts.length + 1);
}

function crossingIntoHighThresholdAddsWarningAlert() {
  let { state, action, nextLoadData } = getLowToHighMocks();
  let newAlert = getAlertsFromLoadData(state, action, nextLoadData)[0];
  expect(newAlert.type).toEqual("warning");
}

function crossingIntoLowThresholdAddsAlert() {
  let { state, action, nextLoadData } = getHighToLowMocks();
  let alerts = getAlertsFromLoadData(state, action, nextLoadData);
  expect(alerts.length).toEqual(state.alerts.length + 1);
}

function crossingIntoLowThresholdAddsSuccessAlert() {
  let { state, action, nextLoadData } = getHighToLowMocks();
  let newAlert = getAlertsFromLoadData(state, action, nextLoadData)[0];
  expect(newAlert.type).toEqual("success");
}

function remainingInHighThresholdDoesNotAddAlert() {
  let { state, action, nextLoadData } = getHighToHighMocks();
  let alerts = getAlertsFromLoadData(state, action, nextLoadData);
  expect(alerts.length).toEqual(state.alerts.length);
}

function remainingInLowThresholdDoesNotAddAlert() {
  let { state, action, nextLoadData } = getLowToLowMocks();
  let alerts = getAlertsFromLoadData(state, action, nextLoadData);
  expect(alerts.length).toEqual(state.alerts.length);
}

function getLowToHighMocks() {
  return getLoadavgChangeMocks({ prevLoadavg: 1, nextLoadavg: 200 });
}

function getHighToLowMocks() {
  let prevAlerts = [ { type: "warning", }, ];
  let prevLoadavg = 2.2;
  let nextLoadavg = 1;
  return getLoadavgChangeMocks({ prevLoadavg, nextLoadavg, prevAlerts });
}

function getHighToHighMocks() {
  let prevAlerts = [ { type: "warning", }, ];
  let prevLoadavg = 250;
  let nextLoadavg = 250;
  return getLoadavgChangeMocks({ prevLoadavg, nextLoadavg, prevAlerts });
}

function getLowToLowMocks() {
  return getLoadavgChangeMocks({ prevLoadavg: 1, nextLoadavg: 1 });
}

function getLoadavgChangeMocks({ prevLoadavg, nextLoadavg, prevAlerts=[] }) {
  const MIN_OBS = 60; 
  const prevLoadDatum = getLoadDatumMock({ loadavg: prevLoadavg, })
  const prevLoadData = replicate(prevLoadDatum, MIN_OBS);
  const loadDatum = getLoadDatumMock({ loadavg: nextLoadavg });

  const state = getStateMock({ loadData: prevLoadData, alerts: prevAlerts });  
  const action = { loadDatum };
  const nextLoadData = [loadDatum, ...prevLoadData];

  return { state, action, nextLoadData };
}

function getStateMock(props) {
  const defaults = {
    loadAlertThreshold: 2,
    loadData: [],
    loadInterval: 1000,
    alerts: [],
  }
  return { ...defaults, ...props };
}

function getLoadDatumMock(props) {
  const defaults = {
    loadavg: 0,
    timestamp: new Date,
  };
  return { ...defaults, ...props };
}

function replicate(o, n) {
  const result = []
  while (n--) result.push(o);
  return result;
}