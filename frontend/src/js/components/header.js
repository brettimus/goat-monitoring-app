const React = require("react");

const Header = () => ({
    render() {
        return (
            <header>
                <h1 className="app-heading">
                    Hello!
                    <span className="app-heading-sub">
                        Let's monitor some { this.props.theme }.
                    </span>
                </h1>
            </header>
        );
    }
});

module.exports = Header;