type SSEStatus = 'connecting' | 'connected' | 'disconnected'

const config: Record<SSEStatus, { color: string; label: string; pulse: boolean }> = {
  connecting:   { color: 'var(--cb-amber)', label: 'Connecting',   pulse: true  },
  connected:    { color: 'var(--cb-teal)',  label: 'Live',         pulse: true  },
  disconnected: { color: 'var(--cb-rose)',  label: 'Disconnected', pulse: false },
}

const dotColors: Record<SSEStatus, string> = {
  connecting:   'rgba(245,158,11,0.5)',
  connected:    'rgba(45,212,191,0.5)',
  disconnected: 'rgba(242,95,126,0.5)',
}

export function SSEStatusIndicator({ status }: { status: SSEStatus }) {
  const { color, label, pulse } = config[status]

  return (
    <div
      className="font-outfit flex items-center gap-2"
      style={{
        padding: '0.3125rem 0.75rem',
        background: 'var(--cb-surface)',
        border: '1px solid var(--cb-border-sub)',
        borderRadius: '999px',
        transition: 'background 0.25s ease',
      }}
    >
      <span
        style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: color,
          boxShadow: `0 0 5px 1px ${dotColors[status]}`,
          flexShrink: 0,
          animation: pulse ? 'sseDotPulse 2s ease-in-out infinite' : 'none',
        }}
      />
      <span className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-dim)', fontWeight: 500 }}>
        {label}
      </span>
      <style>{`@keyframes sseDotPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  )
}
