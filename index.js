const path = require("path");
const config = {
    pathToIndex: path.join("..", "index.html"),
    pathToAssets: path.join("..", "frontend", "dist")
};
require("./backend/app")(config);