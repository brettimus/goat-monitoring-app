const React = require("react");
const moment = require("moment");
const { capitalize } = require("../utils");

const c3 = require("c3");
require("c3/c3.min.css");

const BootsAreaChart = React.createClass({

    getInitialState() {
        return {
            chart: null,
        };
    },

    componentDidMount() {
        let chart = this.createChart();
        this.setState({ chart });
    },

    componentWillUnmount() {
        chart.unload({
            ids: ["timestamp", "loadavg"],
        });
    },

    componentDidUpdate(prevProps) {
        this.state.chart.load(this.createChartData());
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
                    }
                }
            }
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

    getLoadavgData() {
        const { data } = this.props;
        const loadavgData = data.map( ({loadavg}) => loadavg );
        return ['loadavg', ...loadavgData];
    },

    getTimestampData() {
        const { data } = this.props;
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
                    data={this.props.loadData}
                    title={this.getTitle()} />
            </div>
        );
    },

});


module.exports = Chart;