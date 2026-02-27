const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch the library source in the parent directory
config.watchFolders = [path.resolve(workspaceRoot, "src")];

// Resolve modules from example/node_modules first, then workspace root
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

// Alias the library so `import from 'react-native-dynamic-tray'` works
config.resolver.extraNodeModules = new Proxy(
  {
    "react-native-dynamic-tray": path.resolve(workspaceRoot, "src"),
  },
  {
    get: (target, name) => {
      if (name in target) {
        return target[name];
      }
      // Fall back to example/node_modules for everything else
      return path.join(projectRoot, "node_modules", String(name));
    },
  },
);

module.exports = config;
