import { useEffect } from 'react'
import { useAuthToken } from '../hooks/useAuthToken'

const AUTH_URL = import.meta.env.VITE_AUTH_URL
const COGNITO_ID = import.meta.env.VITE_COGNITO_ID

export const Logout = () => {
  const { removeToken } = useAuthToken()
  useEffect(() => {
    const redirectUri = `${window.location.origin}/auth/signin`
    const url = `${AUTH_URL}/logout?client_id=${COGNITO_ID}&logout_uri=${redirectUri}`
    removeToken()
    window.location.href = url
  }, [])

  return (<></>)
}