const React = require("react");

const { roundToTenths } = require("../utils");

const ChartUpdateIntervalControl = () => ({
    handleChange(event) {
        const chartUpdateInterval = +event.target.value * 1000;
        const setting = { chartUpdateInterval };
        this.props.update(setting)
    },

    render() {
        return (
            <input 
                className="control-input control-input--number"
                onChange={(e) => this.handleChange(e)}
                type="number" 
                value={this.props.chartUpdateInterval / 1000} />
        );
    },
});

const AlertThresholdControl = () => ({

    decrement(event) {
        event.stopPropagation();
        event.preventDefault();
        this.updateThreshold(this.props.loadAlertThreshold - .1);
    },

    increment(event) {
        event.stopPropagation();
        event.preventDefault();
        this.updateThreshold(this.props.loadAlertThreshold + .1);
    },

    updateThreshold(loadAlertThreshold) {
        loadAlertThreshold = roundToTenths(loadAlertThreshold);
        this.props.update({ loadAlertThreshold });
    },

    render() {
        return (
            <div className="control-buttons">
                <button onClick={(e) => this.decrement(e)}
                    className="control-button control-button--circle">
                    -
                </button>
                <button onClick={(e) => this.increment(e)}
                    className="control-button control-button--circle">
                    +
                </button> 
            </div> 
        );
    },
});

module.exports = { ChartUpdateIntervalControl, AlertThresholdControl };