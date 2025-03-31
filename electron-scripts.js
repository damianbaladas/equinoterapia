
// This file contains scripts to be added to package.json
// Since we cannot directly modify package.json, we'll create 
// this helper file with instructions for the user

console.log(`
Please add the following scripts to your package.json:

"electron:dev": "concurrently -k \"cross-env BROWSER=none vite\" \"electron electron/main.js\"",
"electron:build": "vite build && electron-builder build --config electron-builder.json",
"electron:pack": "electron-builder --dir",
"postinstall": "electron-builder install-app-deps"

And create an electron-builder.json file with the configuration below.
`);

// Export the electron-builder configuration
module.exports = {
  // Instructions for the user
  packageJsonScripts: {
    "electron:dev": "concurrently -k \"cross-env BROWSER=none vite\" \"electron electron/main.js\"",
    "electron:build": "vite build && electron-builder build --config electron-builder.json",
    "electron:pack": "electron-builder --dir",
    "postinstall": "electron-builder install-app-deps"
  }
};
