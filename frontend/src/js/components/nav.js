const React = require("react");
const ThemeButton = require("./theme-button");

const Nav = () => ({
    render() {
        return (
            <nav className="nav"> 
                <ThemeButton {...this.props} />
            </nav>
        );
    }
});

module.exports = Nav;