const COLORS = [
  { bg: 'rgba(124,110,250,0.2)', border: 'rgba(124,110,250,0.4)', text: '#8B83FC' },
  { bg: 'rgba(45,212,191,0.15)', border: 'rgba(45,212,191,0.35)', text: '#2DD4BF' },
  { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
  { bg: 'rgba(242,95,126,0.15)', border: 'rgba(242,95,126,0.35)', text: '#F25F7E' },
  { bg: 'rgba(139,131,252,0.18)', border: 'rgba(139,131,252,0.4)', text: '#A89BFF' },
  { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.35)', text: '#38BDF8' },
]

function hashColor(name: string) {
  let hash = 0
  for (const char of name) hash = char.charCodeAt(0) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

interface AvatarProps {
  name: string
  avatarUrl?: string | null
  size?: 'sm' | 'md'
}

export function Avatar({ name, avatarUrl, size = 'md' }: AvatarProps) {
  const dim = size === 'sm' ? 26 : 32
  const fontSize = size === 'sm' ? '0.625rem' : '0.75rem'
  const color = hashColor(name)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        background: color.bg,
        border: `1px solid ${color.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color.text,
        fontSize,
        fontWeight: 600,
        fontFamily: "'Outfit', sans-serif",
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials(name)}
    </div>
  )
}
