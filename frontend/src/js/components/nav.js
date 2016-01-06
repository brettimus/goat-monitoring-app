const React = require("react");

const ThemeButton = () => ({

    getEmoji() {
        if (this.props.theme !== "goat")
            return "🐐";
        return "🖥";
    },

    handleGoatClick() {
        let type = "TOGGLE_THEME";
        this.props.store.dispatch({ type });
        return this;
    },

    render() {
        return (
            <span onClick={() => this.handleGoatClick()} className="emoji theme-button">
                {this.getEmoji()}
            </span>
        );
    },
});

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