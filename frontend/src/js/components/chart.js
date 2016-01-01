const React = require("react");
const { AreaChart }  = require("react-d3");
const moment = require("moment");
const { capitalize } = require("../utils");
const Chart = () => ({

    getChartData() {
        const { loadData } = this.props;
        return [{
            name: "loadavg",
            values: this.transformLoadData(loadData),
        }];
    },

    getTitle() {
        let { theme } = this.props;
        let title = capitalize(theme)
        return title;
    },

    transformLoadData(loadData) {
        return loadData.map((d, i) => {
            const x = i + 1;
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
            <div className="container container--charts">
                <AreaChart 
                    data={data}
                    width={600}
                    height={400}
                    viewBoxObject={viewBox}
                    xAxisTickInterval={xAxisTickInterval}
                    title={this.getTitle()} />
            </div>
        );
    },

});


module.exports = Chart;