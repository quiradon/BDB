const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, '/app/icon.ico')
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "book-db",
        "authors": "Quiradon",
        "setupIcon": "app/assets/icon.png"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {
        "options": {
          "name": "book-db",
          "productDescription": "A simple book database",
          "icon": "app/assets/icon.png"
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {
      },
    },
  ],
}