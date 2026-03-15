export function WorkspaceCardSkeleton() {
  return (
    <div
      style={{
        padding: '1.375rem',
        background: 'var(--cb-surface)',
        border: '1px solid var(--cb-border-sub)',
        borderRadius: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="cb-skeleton" style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0 }} />
        <div className="cb-skeleton" style={{ height: '15px', width: '55%' }} />
        <div className="cb-skeleton" style={{ height: '20px', width: '48px', borderRadius: '999px', marginLeft: 'auto' }} />
      </div>
      <div
        style={{
          display: 'flex', justifyContent: 'flex-end', gap: '0.375rem',
          marginTop: '0.25rem', paddingTop: '0.625rem',
          borderTop: '1px solid var(--cb-border-sub)',
        }}
      >
        <div className="cb-skeleton" style={{ height: '28px', width: '84px', borderRadius: '0.375rem' }} />
        <div className="cb-skeleton" style={{ height: '28px', width: '32px', borderRadius: '0.375rem' }} />
      </div>
    </div>
  )
}
