[![Urbex Note Generator](./img/banner.png)](https://urbex-note-generator.vercel.app)

A web app and Chrome extension to quickly generate notes for commenting Urbex (urban exploration) locations.

-   [Live Website](https://urbex-note-generator.vercel.app)
-   [Chrome Extension](https://urbex-note-generator.vercel.app/404)

---

## Features

-   Generate notes for commenting Urbex locations
-   Copy notes to clipboard
-   Customizable types, status and risks
-   Import/export custom items (via JSON or URL)
-   Color themes (`light`, `dark`, `pink`, `cookie`, `marine`)
-   Chrome extension for quick access (NOTE: data from the web app is not shared with the extension)
-   Responsive design for mobile and desktop

---

## Project Structure

```
Urbex-note-generator/
├── site/           # Vue 3 web app (Vite)
│   ├── dist/               # Build output
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # CSS, images, JS stores/constants
│   │   ├── components/     # Vue components
│   │   ├── views/          # Vue views/pages
│   │   └── router/         # Vue Router config
│   └── ...
├── extension/      # Chrome extension (iframe wrapper)
│   ├── dist/               # Build output
│   ├── src/
│   │   ├── index.html      # HTML file for the extension
│   │   ├── manifest.json   # Chrome extension manifest
│   │   └── icon.png        # Extension icon
│   ├── build.js            # Build script
│   └── ...
├── README.md               # This file
├── LICENSE                 # License file
└── ...
```

---

## Getting Started

### Web App

1. `npm run install:site`
2. `npm run start :site`

### Chrome Extension

1. Go to `chrome://extensions/` in your browser
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder
4. The extension will open the web app in a popup

### Building for Production

1. For the web app, run `npm run build:site`, the built files will be in the `site/dist/` folder
2. For the Chrome extension, run `npm run install:extension` then `npm run build:extension`, the built files will be in the `extension/dist/` folder

---

## License

MIT License — see [LICENSE](./LICENSE)
Notice: This project is not affiliated with or endorsed by any Urbex community or organization. It is a personal project for educational purposes.

---

# Privacy Notice

This project does not collect or store any personal data. All data is stored locally in the browser's storage and is not shared with any external servers or services. The Chrome extension operates independently of the web app, and no data is transferred between them.
