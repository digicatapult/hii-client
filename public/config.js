const config = {
  mapboxToken: '',
  mapboxStyle: 'mapbox://styles/digicat-mapbox/clcj7eskl001q14o5bed5oam4',
  publicBasePath: '/',
}

if (!Window.config) {
  Window.config = {}
}

Window.config = Object.keys(config).reduce((out, next) => {
  if (!out.hasOwnProperty(next)) out[next] = config[next]
  return out
}, {})
