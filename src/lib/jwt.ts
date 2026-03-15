export function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64url = token.split('.')[1]
  // Convert base64url → standard base64 then decode
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  return JSON.parse(atob(padded))
}

export function getUidFromToken(idToken: string): string {
  const payload = decodeJwtPayload(idToken)
  return (payload.sub ?? payload.user_id ?? '') as string
}

// Returns true if the token is expired or will expire within 60 seconds
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true
  try {
    const { exp } = decodeJwtPayload(token)
    if (typeof exp !== 'number') return true
    return Date.now() / 1000 >= exp - 60
  } catch {
    return true
  }
}
