const { createRequestHandler } = require("@netlify/remix-adapter");
const { createApp } = require("h3");

// Import your server build
const build = require("./build");

const app = createApp();
app.use(createRequestHandler({ build }));

export default app;