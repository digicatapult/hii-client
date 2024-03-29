# hii-client

## Deprecation Notice
This application was deprecated on March 14th 2024, there will be no further dependency or security updates.
---

Front-end for the Hydrogen Innovation Initiative

## Configuration

At **BUILD** time, `hii-client` is configured using environment variables in a `.env` file at the root of the `/src` folder:

> TODO update these with what we need, leaving this as an example so it's easier to update, same config.js and env.js

| variable     | required |                          default                           | description                                                   |
| :----------- | :------: | :--------------------------------------------------------: | :------------------------------------------------------------ |
| MAPBOX_TOKEN |    Y     |                             -                              | Required to render the map. Token for your Mapbox account     |
| MAPBOX_STYLE |    N     | `mapbox://styles/digicat-mapbox/clcja9aj6001d14o3yn7wvowa` | Map [style](https://docs.mapbox.com/mapbox-gl-js/style-spec/) |

At **RUNTIME**, edit [`config.js`](./public/config.js). Default values:

```js
{
  mapboxToken: 'YOUR_TOKEN',
  mapboxStyle: 'mapbox://styles/digicat-mapbox/clcja9aj6001d14o3yn7wvowa',
}
```

## Getting started

```sh
 # install packages
npm i
 # start service in dev mode
npm run dev
```

View the UI at [`localhost:3000`](http://localhost:3000/).

### Production

Utilise webpack to bundle everything for production use by running:

```sh
npm build
```

This will create a `build/` folder where bundled `.js` files will live which can be served by a web service.

## Integration E2E testing

This repository uses Cypress for testing UI. Specs are found in [cypress/integration](./cypress/integration).

To run tests, start the service:

```sh
npm run dev
```

In a separate console window run either:

```sh
npm run test:integration
# OR
npm run test:dev # runs component test runner
```

### Assets

- fonts are stored in [`src/assets/fonts`](./src/assets/fonts) and imported globally in [`src/index.js`](./src/index.js).
- images are stored in [`src/assets/images`](./src/assets/images/) and loaders configured in [`webpack.config`](./webpack.config.js).
