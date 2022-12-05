import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'

export const RefreshTimer = () => {
  const nav = useNavigate()

  var now = new Date()
  var millisecondsUntil5 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0, 0) - now
  if (millisecondsUntil5 < 0) {
    millisecondsUntil5 += 86400000 // it after 5am, try again at 5am tomorrow.
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      nav('/')
      if (window.location.pathname === '/') {
        //The if statement stops other pages reloading before redirecting
        window.location.reload()
      }
    }, millisecondsUntil5)
    return () => {
      clearTimeout(handle)
    }
  }, [millisecondsUntil5, nav])

  return <></>
}
