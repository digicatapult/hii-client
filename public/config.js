const config = {
  dsbdApiPort: 3001,
  dsbdApiHost: 'localhost',
}

if (!Window.config) {
  Window.config = {}
}

Window.config = Object.keys(config).reduce((out, next) => {
  if (!out.hasOwnProperty(next)) out[next] = config[next]
  return out
}, {})
