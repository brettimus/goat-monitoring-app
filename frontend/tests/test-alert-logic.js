const expect = require("expect");
const deepFreeze = require("deep-freeze");

const getAlertsFromLoadData = require("../src/js/reducers/app-actions-alerts");

crossingIntoHighThresholdAddsAlert();
crossingIntoHighThresholdAddsWarningAlert();
crossingIntoLowThresholdAddsAlert();
crossingIntoLowThresholdAddsSuccessAlert();
remainingInHighThresholdDoesNotAddAlert();
remainingInLowThresholdDoesNotAddAlert();

function crossingIntoHighThresholdAddsAlert() {
  let { state, action, newLoadData } = getLowToHighMocks();
  let alerts = getAlertsFromLoadData(state, action, newLoadData);
  expect(alerts.length).toEqual(state.alerts.length + 1);
}

function crossingIntoHighThresholdAddsWarningAlert() {
  let { state, action, newLoadData } = getLowToHighMocks();
  let newAlert = getAlertsFromLoadData(state, action, newLoadData)[0];
  expect(newAlert.type).toEqual("warning");
}

function crossingIntoLowThresholdAddsAlert() {
  let { state, action, newLoadData } = getHighToLowMocks();
  let alerts = getAlertsFromLoadData(state, action, newLoadData);
  expect(alerts.length).toEqual(state.alerts.length + 1);
}

function crossingIntoLowThresholdAddsSuccessAlert() {
  let { state, action, newLoadData } = getHighToLowMocks();
  let newAlert = getAlertsFromLoadData(state, action, newLoadData)[0];
  expect(newAlert.type).toEqual("success");
}

function remainingInHighThresholdDoesNotAddAlert() {
  let { state, action, newLoadData } = getHighToHighMocks();
  let alerts = getAlertsFromLoadData(state, action, newLoadData);
  expect(alerts.length).toEqual(state.alerts.length);
}

function remainingInLowThresholdDoesNotAddAlert() {
  let { state, action, newLoadData } = getLowToLowMocks();
  let alerts = getAlertsFromLoadData(state, action, newLoadData);
  expect(alerts.length).toEqual(state.alerts.length);
}

function getLowToHighMocks() {
  return getLoadavgChangeMocks({ prevLoadavg: 1, nextLoadavg: 200 });
}

function getHighToLowMocks() {
  return getLoadavgChangeMocks({ prevLoadavg: 2.2, nextLoadavg: 1 });
}

function getHighToHighMocks() {
  return getLoadavgChangeMocks({ prevLoadavg: 200, nextLoadavg: 250 });
}

function getLowToLowMocks() {
  return getLoadavgChangeMocks({ prevLoadavg: 1, nextLoadavg: 1 });
}

function getLoadavgChangeMocks({ prevLoadavg, nextLoadavg }) {
  let prevLoadData = [ getLoadDatumMock({ loadavg: prevLoadavg }) ];
  let loadDatum = getLoadDatumMock({ loadavg: nextLoadavg });

  let state = getStateMock({ loadData: prevLoadData });
  let action = { loadDatum };
  let newLoadData = [loadDatum, ...prevLoadData];

  return { state, action, newLoadData };
}

function getStateMock(props) {
  const defaults = {
    loadAlertThreshold: 2,
    loadData: [],
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