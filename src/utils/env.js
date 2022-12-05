const DSBD_API_HOST =
  process.env.DSBD_API_HOST || Window.config.dsbdApiHost || 'localhost'
const DSBD_API_PORT =
  process.env.DSBD_API_PORT || Window.config.dsbdApiPort || 3001
const DSBD_API_URL = `http://${DSBD_API_HOST}:${DSBD_API_PORT}`
// keeping these env variables as an example so when we update we can use this as reference

export { DSBD_API_HOST, DSBD_API_PORT, DSBD_API_URL }
