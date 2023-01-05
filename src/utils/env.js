const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || Window.config.mapboxToken || ''
const MAPBOX_STYLE =
  process.env.MAPBOX_STYLE ||
  Window.config.mapboxStyle ||
  'mapbox://styles/digicat-mapbox/clcj7eskl001q14o5bed5oam4'
const PUBLIC_BASE_PATH =
  process.env.PUBLIC_BASE_PATH || Window.config.publicBasePath || '/'

export { MAPBOX_TOKEN, MAPBOX_STYLE, PUBLIC_BASE_PATH }
