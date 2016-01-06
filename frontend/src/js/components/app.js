const React = require("react");
const io = require("socket.io-client");

const Alerts = require("./alerts");
const Chart = require("./chart");
const Header = require("./header");
const Nav = require("./nav");

const App = () => ({

    addLoadDatum(loadDatum) {
        this.props.store.dispatch({
            type: "ADD_LOAD_DATUM",
            loadDatum,
        });
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

    randomLoadDatum() {
        return {
            timestamp: new Date(),
            loadavg1: Math.random() * 2.5,
            loadavg5: Math.random() * 2.5,
            loadavg15: Math.random() * 2.5,
        };
    },

    startListeningForData() {
        if (__DEV__) {
            this._socket = setInterval(() => this.handleData(this.randomLoadDatum()), 1000)
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
        const { alerts } = state;
        const { themeName } = state;
        const buffer = state.chartDataBuffer;

        if (__DEV__) console.log("Current state: ", state);

        return (
            <div className="app-container">
                <Nav store={this.props.store} theme={themeName}></Nav>
                <Header store={this.props.store} theme={themeName} />
                <Chart store={this.props.store} 
                        theme={themeName}
                        buffer={buffer} 
                        data={loadData} 
                        latestChartTimestamp={latestChartTimestamp}
                        latestDatumTimestamp={latestDatumTimestamp} 
                        chartUpdateInterval={chartUpdateInterval} />

                <Alerts alerts={alerts} theme={themeName} />
            </div>
        );
    },
});

module.exports = App;