const React = require("react");
const { VelocityComponent } = require("velocity-react");

const { 
    AlertThresholdControl, 
    ChartUpdateIntervalControl } = require("./control-panel-form-controls");

const ControlPanelForm = () => ({

    updateSetting(control) {
        const type = "UPDATE_CONTROL";
        this.props.store.dispatch({ type, control });
        return this;
    },

    render() {
        const state = this.props.store.getState();
        const { chartUpdateInterval, loadAlertThreshold } = state;

        return (
            <form className="form form--controls">
                <fieldset>
                    Update the chart data every
                    &nbsp;
                    <ChartUpdateIntervalControl 
                        update={ (d) => this.updateSetting(d) }
                        chartUpdateInterval={chartUpdateInterval} />
                    &nbsp;
                    seconds.
                </fieldset>
                <fieldset>
                    Alert me when two-minute load average exceeds
                    &nbsp;
                    <input disabled className="control-input control-input--number" value={loadAlertThreshold} />
                    &nbsp;
                    <AlertThresholdControl 
                        update={ (d) => this.updateSetting(d) }
                        loadAlertThreshold={loadAlertThreshold} />
                </fieldset>
            </form>
        );
    },
});

const ControlPanel = () => ({
    hideControls() {
        const type = "HIDE_CONTROL_PANEL";
        this.props.store.dispatch({ type });
        return this;
    },

    isHidden() {
        return !this.props.showControlPanel;
    },

    styles() {
        const styles = this.isHidden() ? { display: "none" } : {};
        return styles;
    },

    render() {
        const opacity = this.isHidden() ? 0 : 1;
        const animation = { opacity };
        return (
            <VelocityComponent animation={animation} duration={300}>
                <div className="" style={this.styles()}>
                    <p>
                        <a className="controls-action controls-action--hide" 
                            onClick={ () => this.hideControls() }> 
                          Hide my settings!
                        </a>
                    </p>
                    <ControlPanelForm store={this.props.store} />
                </div>
            </VelocityComponent>
        );
    }
});

module.exports = ControlPanel;