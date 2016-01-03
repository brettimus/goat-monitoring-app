const React = require("react");
const moment = require("moment");
const { capitalize, roundToThousandths } = require("../utils");

const AlertData = () => ({
    render() {
        let { theme, twoMinuteAvg, timestamp } = this.props;
        return (
            <table className="alert-data-table">
            <thead>
                <tr>
                    <th>
                       {capitalize(theme)}
                    </th>
                    <th>Triggered at</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{roundToThousandths(twoMinuteAvg)}</td>
                    <td>
                        {moment(timestamp).format("h:mm:ss a")}
                        <span className="alert-timestamp">
                            {moment(timestamp).format("(MMM Do, YYYY)")}
                        </span>
                    </td>
                </tr>
            </tbody>
            </table>
        );
    },
});

const Alert = () => ({
    message() {
        return this.props.message.replace("{theme}", this.props.theme);
    },

    renderAlertData() {

    },

    render() {
        let classNames = ["alert", "alert--" + this.props.type ];
        return (
            <article className={classNames.join(" ")}>
                <div className="alert-message">
                    {this.message()}
                    <span className="alert-timestamp alert-timestamp--relative">
                        {moment(this.props.timestamp).fromNow()}
                    </span>
                </div>
                <div className="alert-data">
                    <AlertData {...this.props}  />
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
        if (alerts.length === 0) return `No ${theme} alerts to show!`;

        // let count = alerts.length > 1 ? alerts.length : "";
        // return `Displaying ${count} most recent ${theme} alerts.`;
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