const React = require("react");
const io = require("socket.io-client");

const Chart = require("./chart");
const Alerts = require("./alerts");

const ThemeButton = require("./theme-button");

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
        if (__DEV__) {
            const loadDatum = {
                timestamp: new Date(),
                loadavg: Math.random() * 2.5,
            };            
            this.addLoadDatum(loadDatum);
            return;
        }
        let loadavg = data.loadavg1;
        let { timestamp } = data;
        this.addLoadDatum({ loadavg, timestamp });
    },

    startListeningForData() {
        if (__DEV__) {
            this._dataHandler = setInterval(() => this.handleData(), 1000)            
        }
        else {
            let socket = io();
            socket.on('loadavg update', (data) => this.handleData(data));
        }
    },

    stopListeningForData() {
        if (__DEV__) clearInterval(this._dataHandler);
    },

    render() {
        let state = this.props.store.getState();
        let { loadData } = state;
        let { alerts, lastTimestamp } = state;
        let { themeName } = state;
        console.log("Current state: ", state);

        return (
            <div className="app-container">
                <nav className="nav"> 
                    <ThemeButton theme={themeName}  store={this.props.store} />
                </nav>
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