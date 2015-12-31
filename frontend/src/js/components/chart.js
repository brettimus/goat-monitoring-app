const React = require("react");
const { AreaChart }  = require("react-d3");
const moment = require("moment");

const Chart = () => ({

    getChartData() {
        const { loadData } = this.props;
        return [{
            name: "loadavg",
            values: this.transformLoadData(loadData),
        }];
    },

    transformLoadData(loadData) {
        return loadData.map((d, i) => {
            // let x = moment(d.timestamp).fromNow();
            const x = i; // d.timestamp;
            const y = d.loadavg;
            return { x, y };
        });
    },

    render() {
        const data = this.getChartData();
        const viewBox = {
            x: 0,
            y: 0,
            height: 400,
            width: 600,
        };

        const xAxisTickInterval = {
            unit: '', interval: 1,
        };

        return (
            <AreaChart 
                data={data}
                width={600}
                height={400}
                viewBoxObject={viewBox}
                xAxisTickInterval={xAxisTickInterval}
                title="Goats" />
        );
    }
})


module.exports = Chart;