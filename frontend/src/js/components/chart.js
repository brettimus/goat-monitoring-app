const React = require("react");
const moment = require("moment");
const { capitalize, head } = require("../utils");

const c3 = require("c3");
require("c3/c3.min.css");

const BootsAreaChart = React.createClass({

    getInitialState() {
        return {
            chart: null,
            latestChartTimestamp: null,
        };
    },

    componentDidMount() {
        let chart = this.createChart();
        let latestChartTimestamp = this.getLatestTimestamp();
        this.setState({ chart, latestChartTimestamp });
    },

    componentWillUnmount() {
        chart.unload({
            ids: ["timestamp", "loadavg"],
        });
    },

    componentDidUpdate(prevProps) {
        if (prevProps.latest === this.props.latest) {
            // no new charting data
            return;
        }
        let data = this.createChartData();
        let flowColumns = data.columns.map((c) => {
            return [head(c), c[1]]
        });

        if (!this.isReadyForChartUpdate()) {
            this.bufferFlowColumns(flowColumns);
            return;
        };

        if (this.props.buffer) {
            flowColumns = this.mergeBufferWithCols(flowColumns);
            this.flushBuffer();
        }

        this.state.chart.flow({
            columns: flowColumns,
        })

        this.setState({
            latestChartTimestamp: this.getLatestTimestamp(),
        })

        // debugger;
        // TODO - setTimteout instead (?)
    },

    mergeBufferWithCols(flowColumns) {
        const { buffer } = this.props;
        const colNames = Object.keys(buffer);
        return colNames.map((colName) => {
            let prevData = buffer[colName]; // e.g., [colName, d1, d2, ...]
            let nextData = flowColumns.find((col) => col[0] === colName);
            if (!nextData) return prevData;
            let nextDatum = nextData[1];
            return [...prevData, nextDatum];
        });
    },

    bufferFlowColumns(columns) {
        this.props.store.dispatch({
            type: "BUFFER_CHART_DATA",
            columns,
        });
    },

    flushBuffer() {
        this.props.store.dispatch({
            type: "FLUSH_BUFFER"
        });
    },

    isReadyForChartUpdate() {
        const UPDATE_SPAN = 3000; // 3s
        const latestTimestamp = this.getLatestTimestamp();
        const { latestChartTimestamp } = this.state;
        const timeSinceLastUpdate = latestTimestamp - latestChartTimestamp;
        return (timeSinceLastUpdate >= UPDATE_SPAN);
    },

    createChart() {
        let bindto = this.refs.chartContainer;
        let data = this.createChartData();
        return c3.generate({
            bindto,
            data,
            axis: {
                x: {
                    type: "timeseries",
                    tick: {
                        count: 60,
                        format: '%H:%M:%S',
                    },
                },
            },
            point: {
                show: false
            },
        });
    },

    createChartData() {
        return {
            x: "timestamp",
            columns: [
                this.getTimestampData(),
                this.getLoadavgData(),
            ],
        };
    },

    getLatestTimestamp() {
        return this.props.latest.timestamp;
    },

    getLoadavgData(props) {
        const { data } = props || this.props;
        const loadavgData = data.map( ({loadavg}) => loadavg );
        return ['loadavg', ...loadavgData];
    },

    getTimestampData(props) {
        const { data } = props || this.props;
        const timestampData = data.map( ({timestamp}) => timestamp );
        return ['timestamp', ...timestampData];
    },

    render() {
        return (
            <div ref="chartContainer" />
        );
    },
});

const Chart = () => ({

    getTitle() {
        let { theme } = this.props;
        let title = capitalize(theme)
        return title;
    },

    render() {
        return (
            <div className="container container--charts">
                <h2 className="chart-heading">
                    Load average over the past 10 minutes
                    <span className="chart-heading-sub">
                        
                    </span>
                </h2>
                <BootsAreaChart
                    store={this.props.store}
                    buffer={this.props.buffer}
                    data={this.props.loadData}
                    latest={this.props.latestDatum}
                    title={this.getTitle()} />
            </div>
        );
    },

});


module.exports = Chart;