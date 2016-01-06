const React = require("react");

const Settings = () => ({

    isHidden() {
        return this.props.showControlPanel;
    },

    showControls() {
        let type = "SHOW_CONTROL_PANEL";
        this.props.store.dispatch({ type });
        return this;
    },

    render () {
        const styles = this.isHidden() ? { display: "none" } : {};
        return (
            <div style={styles} className="controls">
                <a className="controls-action controls-action--expand" onClick={ (e) => this.showControls() }>
                    Modify my settings &raquo;
                </a>
            </div>
        );
    },
});

module.exports = Settings;