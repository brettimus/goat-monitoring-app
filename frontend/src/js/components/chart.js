require("c3/c3.min.css");
const c3 = require("c3");
const React = require("react");
const { capitalize, head, tail } = require("../utils");

const RealTimeLineChart = React.createClass({

    getInitialState() {
        return { chart: null };
    },

    componentDidMount() {
        this.createChart();
    },

    componentWillUnmount() {
        chart.unload({
            ids: ["timestamp", "loadavg"],
        });
    },

    componentDidUpdate(prevProps) {
        if (this.arePrevPropsDataOld(prevProps)) return;

        let columns = this.getFlowColumns();

        if (!this.isReadyForChartUpdate())
            return this.bufferFlowColumns(columns);
        
        columns = this.mergeBufferWithCols(columns);

        this.flushBuffer().updateChart({ columns });
    },

    createChart() {
        let bindto = this.refs.chartContainer;
        let data = this.createChartData();
        let chart = c3.generate({
            bindto,
            data,
            axis: this.getAxisConfig(),
            point: { show: false },
        });
        this.setState({ chart });
        this.recordChartUpdate();
        return this;
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

    getAxisConfig() {
        return {
            x: {
                type: "timeseries",
                tick: {
                    count: 6,
                    format: '%H:%M:%S',
                },
            },
            loadavg: { min: 0 },
        };
    },

    getFlowColumns() {
        let data = this.createChartData();
        return data.columns.map((c) => {
            return [ head(c), head(tail(c)) ];
        });
    },

    arePrevPropsDataOld(prevProps) {
        return prevProps.latestDatumTimestamp === this.props.latestDatumTimestamp
    },

    mergeBufferWithCols(flowColumns) {
        const { buffer } = this.props;
        if (!buffer) return flowColumns;

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
        const type = "BUFFER_CHART_DATA";
        this.props.store.dispatch({ type, columns });
        return this;
    },

    flushBuffer() {
        const type = "FLUSH_BUFFER";
        this.props.store.dispatch({ type });
        return this;
    },

    recordChartUpdate() {
        const type = "RECORD_CHART_UPDATE";
        this.props.store.dispatch({ type });
        return this;
    },

    updateChart({ columns }) {
        this.state.chart.flow({ columns });
        this.recordChartUpdate();
        return this;
    },

    isReadyForChartUpdate() {
        const { latestDatumTimestamp } = this.props;
        const { latestChartTimestamp } = this.props;
        if (latestChartTimestamp === null) return true;
        const timeSinceLastUpdate = latestDatumTimestamp - latestChartTimestamp;
        const { chartUpdateInterval } = this.props;
        return (timeSinceLastUpdate >= chartUpdateInterval);
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
                <RealTimeLineChart { ...this.props } title={this.getTitle()} />
            </div>
        );
    },
});


module.exports = Chart;