const path = require('path');
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";

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

export default defineConfig({
  plugins: [remix({ presets: [vercelPreset()] })],
});
