export function getApiEndpoint(): string {
  const configured = import.meta.env.VITE_API_ENDPOINT?.trim()
  const fallback = import.meta.env.DEV ? 'http://localhost:8000' : ''
  return (configured || fallback).replace(/\/$/, '')
}

export function requireApiEndpoint(): string {
  const endpoint = getApiEndpoint()
  if (!endpoint) {
    throw new Error('Production API endpoint is not configured. Set VITE_API_ENDPOINT in Vercel.')
  }
  return endpoint
}
