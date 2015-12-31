const React = require("react");

const Chart = require("./chart");
const Alerts = require("./alerts");

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
        const loadDatum = {
            timestamp: new Date(),
            loadavg: Math.random() * 2.5,
        };

        this.addLoadDatum(loadDatum);
    },

    dispatchAlert(message) {
        this.props.store.dispatch({
            type: "CREATE_ALERT",
            message,
        });
    },

    startListeningForData() {
        this._dataHandler = setInterval(() => this.handleData(), 1000)
    },

    stopListeningForData() {
        clearInterval(this._dataHandler);
    },

    render() {
        let state = this.props.store.getState();
        let { loadData } = state;
        let { alerts, lastTimestamp, twoMinuteAvg } = state;

        console.log("Current state: ", state);

        return (
            <div className="app-container">
                <h1>
                    Hello!
                </h1>
                <p>Let's monitor some goats.</p>
                <Chart loadData={loadData} />
                <Alerts alerts={alerts} 
                    currentTimestamp={lastTimestamp}
                    currentTwoMinuteLoadavg={twoMinuteAvg} 
                    dispatchAlert={ (m) => this.dispatchAlert(m) } />
            </div>
        );
    },
});

module.exports = App;