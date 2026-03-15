export function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload))
}

export function getUidFromToken(idToken: string): string {
  const payload = decodeJwtPayload(idToken)
  return (payload.sub ?? payload.user_id ?? '') as string
}
