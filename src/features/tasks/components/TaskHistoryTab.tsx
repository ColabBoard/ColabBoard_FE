import { formatDistanceToNow } from 'date-fns'
import { useTaskHistory } from '../hooks/useTaskHistory'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = ['var(--cb-accent)', 'var(--cb-teal)', 'var(--cb-amber)', 'var(--cb-rose)', 'var(--cb-accent-bright)']
const AVATAR_HEX =    ['#7C6EFA',          '#2DD4BF',        '#F59E0B',         '#F25F7E',         '#8B83FC']

function hashIdx(name: string) {
  let h = 0
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h)
  return Math.abs(h) % AVATAR_COLORS.length
}

export function TaskHistoryTab({ taskId }: { taskId: string }) {
  const { data: entries, isLoading } = useTaskHistory(taskId)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div className="cb-skeleton" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div className="cb-skeleton" style={{ height: '12px', width: '70%' }} />
              <div className="cb-skeleton" style={{ height: '11px', width: '35%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="font-outfit" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--cb-dim)', fontSize: '0.8125rem' }}>
        No history yet.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[...entries].reverse().map((entry) => {
        const idx = hashIdx(entry.actor)
        const hex = AVATAR_HEX[idx]
        return (
          <div key={entry.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div
              className="font-outfit shrink-0"
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: `${hex}20`,
                border: `1px solid ${hex}50`,
                color: AVATAR_COLORS[idx],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.625rem', fontWeight: 600,
              }}
            >
              {initials(entry.actor)}
            </div>
            <div>
              <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-text)', lineHeight: 1.5 }}>
                {entry.action}
              </p>
              <p className="font-outfit" style={{ fontSize: '0.6875rem', color: 'var(--cb-dim)', marginTop: '0.2rem' }}>
                {entry.actor} · {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
