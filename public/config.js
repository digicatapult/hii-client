const config = {
  apiPort: 3001,
  apiHost: 'localhost',
  mapboxToken: '',
  mapboxStyle: 'mapbox://styles/jonathangray/clbw89spy000n14t1ezcttd3e',
}

if (!Window.config) {
  Window.config = {}
}

Window.config = Object.keys(config).reduce((out, next) => {
  if (!out.hasOwnProperty(next)) out[next] = config[next]
  return out
}, {})
