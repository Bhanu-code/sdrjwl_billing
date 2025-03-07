const path = require('path');

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