const config = {
  mapboxToken: '',
  mapboxStyle: 'mapbox://styles/digicat-mapbox/clcja9aj6001d14o3yn7wvowa',
  publicBasePath: '/',
}

if (!Window.config) {
  Window.config = {}
}

Window.config = Object.keys(config).reduce((out, next) => {
  if (!out.hasOwnProperty(next)) out[next] = config[next]
  return out
}, {})
