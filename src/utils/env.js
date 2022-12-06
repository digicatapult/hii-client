const API_HOST = process.env.API_HOST || Window.config.apiHost || 'localhost'
const API_PORT = process.env.API_PORT || Window.config.apiPort || 3001
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || Window.config.MAPBOX_TOKEN
const API_URL = `http://${API_HOST}:${API_PORT}`

export { API_HOST, API_PORT, API_URL, MAPBOX_TOKEN }
