import qs from 'qs'
import { DSBD_API_URL } from './env'

export async function executeBinary(name, params) {
  const queryString = qs.stringify(params)
  const url = `${DSBD_API_URL}/scenario/${name}`

  try {
    const res = await fetch(`${url}?${queryString}`)
    return res.json()
  } catch (e) {
    return e.message
  }
}
