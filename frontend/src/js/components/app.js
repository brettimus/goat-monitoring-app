const React = require("react");
const rd3 = require("react-d3");
const { ScatterChart } = rd3;

const data = [{
    name: "Hehes",
    values: [ {x: 0, y: 10}, {x: 20, y: 40} ],
}];

const App = () => ({

    componentDidMount() {
        this.startListeningForData();
    },

    componentWillUnmount() {
        this.stopListeningForData();
    },

    startListeningForData() {
        this._dataHandler = setInterval(() => this.handleData(), 1000)
    },

    stopListeningForData() {
        clearInterval(this._dataHandler);
    },

    handleData(data) {
        const loadDatum = {
            x: + new Date(),
            y: Math.random() * 2.5,
        };
        this.props.store.dispatch({
            type: "ADD_LOAD_DATUM",
            loadDatum,
        });
    },

    render() {
        let state = this.props.store.getState();
        let data = [{
            name: "loadavg",
            values: state.loadData,
        }];
        console.log("Current state: ", state);
        return (
            <div style={{padding: "6em 8em"}}>
                <h1>
                    Hello!
                </h1>
                <p>Let's monitor some goats.</p>
                <ScatterChart 
                    data={data}
                    width={500}
                    height={400}
                    title="Goats" />
            </div>
        );
    },
});

module.exports = App;