const React = require("react");
const io = require("socket.io-client");

const Alerts = require("./alerts");
const Chart = require("./chart");
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
        let state = this.props.store.getState();
        let { latestDatum, loadData } = state;
        let { alerts } = state;
        let { themeName } = state;
        let buffer = state.chartDataBuffer;
        console.log("Current state: ", state);

        return (
            <div className="app-container">
                <Nav store={this.props.store} theme={themeName}></Nav>
                <header>
                    <h1>
                        Hello!
                    </h1>
                    <p>Let's monitor some { themeName }.</p>
                </header>
                <Chart store={this.props.store} 
                        buffer={buffer} 
                        latestDatum={latestDatum} 
                        loadData={loadData} 
                        theme={themeName} />

                <Alerts alerts={alerts} theme={themeName} />
            </div>
        );
    },
});

module.exports = App;