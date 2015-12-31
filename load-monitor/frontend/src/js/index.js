const React = require("react");
const ReactDOM = require("react-dom");
const {createStore} = require("redux");

const reducer = require("./reducers/app");
const store = createStore(reducer);

const App = require("./components/app");
const appMount = document.getElementById("tada");
const renderApp = () => ReactDOM.render(<App store={store} />, appMount);

store.subscribe(renderApp);
renderApp();