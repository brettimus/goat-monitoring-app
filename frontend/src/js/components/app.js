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

    addRandomLoadDatum() {
        this.addLoadDatum({
            timestamp: new Date(),
            loadavg: Math.random() * 2.5,
        });
    },

    componentDidMount() {
        this.startListeningForData();
    },

    componentWillUnmount() {
        this.stopListeningForData();
    },

    handleData(data) {
        if (__DEV__) {
            this.addRandomLoadDatum();
            return;
        }
        let loadavg = data.loadavg1;
        let { timestamp } = data;
        this.addLoadDatum({ loadavg, timestamp });
    },

    startListeningForData() {
        if (__DEV__) {
            this._socket = setInterval(() => this.handleData(), 1000)
            return;          
        }

        let socket = io();
        socket.on('loadavg update', (data) => this.handleData(data));
        this._socket = socket;
    },

    stopListeningForData() {
        if (__DEV__) {
            clearInterval(this._socket);
        }
        else {
            this._socket.disconnect();
        }
    },

    render() {
        let state = this.props.store.getState();
        let { loadData } = state;
        let { alerts } = state;
        let { themeName } = state;
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
                <Chart loadData={loadData} theme={themeName} />
                <Alerts alerts={alerts} theme={themeName} />
            </div>
        );
    },
});

module.exports = App;