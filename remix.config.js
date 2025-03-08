const path = require('path');
const { withEsbuildOverride } = require("@netlify/remix-adapter");

module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  ignoredRouteFiles: ['.*'],
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route('/', 'routes/index.tsx');
    });
  },
  serverDependenciesToBundle: [
    // Add any dependencies that need to be bundled for the server
  ],
  watchPaths: [
    // Add paths to watch for changes
  ],
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  // Add this to resolve the `~` alias
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
    },
  },
};

withEsbuildOverride((option) => {
  // Add your esbuild configuration here if needed
  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "netlify",
  server: "./server.js",
  ignoredRouteFiles: ["**/.*"],
  // Add other configuration as needed
};