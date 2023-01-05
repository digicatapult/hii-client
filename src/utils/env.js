const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || Window.config.mapboxToken || ''
const MAPBOX_STYLE =
  process.env.MAPBOX_STYLE ||
  Window.config.mapboxStyle ||
  'mapbox://styles/mapbox/light-v11'

export { MAPBOX_TOKEN, MAPBOX_STYLE }
