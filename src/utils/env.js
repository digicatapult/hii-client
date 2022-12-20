const API_HOST = process.env.API_HOST || Window.config.apiHost || 'localhost'
const API_PORT = process.env.API_PORT || Window.config.apiPort || 3001
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || Window.config.mapboxToken
const MAPBOX_STYLE =
  process.env.MAPBOX_STYLE ||
  Window.config.mapboxStyle ||
  'mapbox://styles/mapbox/light-v11'

const API_URL = `http://${API_HOST}:${API_PORT}`

export { API_HOST, API_PORT, MAPBOX_TOKEN, MAPBOX_STYLE, API_URL }
