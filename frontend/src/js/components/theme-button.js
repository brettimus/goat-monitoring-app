const React = require("react");

const ThemeButton = () => ({

    getEmoji() {
        if (this.props.theme !== "goat") {
            return "🐐";
        }
        return "🖥";
    },

    handleGoatClick() {
        this.props.store.dispatch({
            type: "TOGGLE_THEME",
        });
    },

    render() {
        return (
            <span onClick={() => this.handleGoatClick()} className="emoji">
                {this.getEmoji()}
            </span>
        );
    },
});

module.exports = ThemeButton;