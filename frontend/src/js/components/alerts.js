const React = require("react");
const moment = require("moment");
const { capitalize, roundToThousandths } = require("../utils");

const Alert = () => ({
    renderAlertData() {
        let { twoMinuteAvg, timestamp } = this.props;
        if (twoMinuteAvg) {
            return (
                <table>
                <thead>
                    <tr>
                        <th>{capitalize(this.props.theme)}</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{roundToThousandths(twoMinuteAvg)}</td>
                        <td>
                            {moment(timestamp).format("h:mm:ss a (MMM Do, YYYY)")}
                        </td>
                    </tr>
                </tbody>
                </table>
            );
        }
    },

    render() {
        let classNames = ["alert", "alert--" + this.props.type ];
        return (
            <article className={classNames.join(" ")}>
                <div className="alert-message">
                    {this.props.message}
                </div>
                <footer className="alert-timestamp">
                    {moment(this.props.timestamp).fromNow()}
                </footer>
                <div className="alert-data">
                    {this.renderAlertData()}
                </div>
            </article>
        );
    },
});

const Alerts = () => ({

    createAlert(alert, key) {
        return <Alert {...alert} key={key} theme={this.props.theme} />;
    },

    getSubheading() {
        let alerts = this.truncate(this.props.alerts);
        let { theme } = this.props;
        if (alerts.length > 0) {
            return `Displaying ${alerts.length} most recent ${theme} alerts.`;
        }
        return `No ${theme} alerts to show!`;
    },

    renderAlerts() {
        return this.truncate(this.props.alerts).map(this.createAlert, this);
    },

    truncate(alerts, n=10) {
        return alerts.slice(0, n);
    },

    render() {
        let alerts = this.renderAlerts();
        let subheading = this.getSubheading()
        return (
            <section className="container container--alerts">
                <h2 className="alerts-heading">
                    Alerts
                    <span className="alerts-heading-sub">
                        {subheading}
                    </span>
                </h2>
                <div>
                    {alerts}
                </div>
            </section>
        );
    },
})

module.exports = Alerts;