const React = require("react");
const io = require("socket.io-client");

const Alerts = require("./alerts");
const Chart = require("./chart");
const ControlPanel = require("./control-panel");
const Header = require("./header");
const Nav = require("./nav");
const Settings = require("./settings");

const { randomLoadDatum } = require("../utils");

const App = () => ({

    addLoadDatum(loadDatum) {
        const type = "ADD_LOAD_DATUM";
        this.props.store.dispatch({ type, loadDatum });
        return this;
    },

    componentDidMount() {
        this.startListeningForData();
    },

    componentWillUnmount() {
        this.stopListeningForData();
    },

    handleData(data) {
        this.addLoadDatum(data);
    },

    startListeningForData() {
        if (__DEV__) {
            this._socket = setInterval(() => this.handleData(randomLoadDatum()), 1000)
            return;          
        }

        let socket = io();
        socket.on('loadavg update', (data) => this.handleData(data));
        this._socket = socket;
    },

    stopListeningForData() {
        if (__DEV__) {
            clearInterval(this._socket);
            return;
        }

        this._socket.disconnect();
    },

    render() {
        const state = this.props.store.getState();
        const { loadData } = state;
        const { latestChartTimestamp, latestDatumTimestamp } = state;
        const { chartUpdateInterval } = state;
        const { loadInterval } = state;
        const { alerts } = state;
        const { loadAlertThreshold } = state;
        const { showControlPanel } = state;
        const { themeName } = state;
        const buffer = state.chartDataBuffer;

        if (__DEV__) console.log("Current state: ", state);

        return (
            <div className="app-container">
                <Nav store={this.props.store} theme={themeName}></Nav>
                <Header theme={themeName}>
                    <Settings showControlPanel={showControlPanel} store={this.props.store} />
                    <ControlPanel showControlPanel={showControlPanel} store={this.props.store} />
                </Header>
                <Chart store={this.props.store} 
                        theme={themeName}
                        buffer={buffer} 
                        data={loadData} 
                        latestChartTimestamp={latestChartTimestamp}
                        latestDatumTimestamp={latestDatumTimestamp} 
                        chartUpdateInterval={chartUpdateInterval} 
                        loadInterval={loadInterval} />

                <Alerts alerts={alerts} theme={themeName} />
            </div>
        );
    },
});

module.exports = App;