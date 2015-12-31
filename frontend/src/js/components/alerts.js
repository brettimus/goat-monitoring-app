const React = require("react");

const Alert = () => ({
    render() {
        let classNames = ["alert", "alert-" + this.props.type ].join(" ");
        return (
            <article className={classNames}>
                {this.props.message}
            </article>
        );
    },
});

const Alerts = () => ({

    createAlert(alert, key) {
        return <Alert {...alert} key={key} />
    },

    renderAlerts() {
        return this.props.alerts.map(this.createAlert);
    },

    render() {
        return (
            <section className="alerts-container">
                <h2 className="alerts-heading">Alerts</h2>
                {this.renderAlerts()}
            </section>
        );
    },
})

module.exports = Alerts;