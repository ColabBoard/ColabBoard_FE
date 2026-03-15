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
      </div>
      <div className="cb-skeleton" style={{ height: '12px', width: '90%' }} />
      <div className="cb-skeleton" style={{ height: '12px', width: '70%' }} />
      <div
        style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '0.375rem', paddingTop: '0.625rem',
          borderTop: '1px solid var(--cb-border-sub)',
        }}
      >
        <div className="cb-skeleton" style={{ height: '11px', width: '25%' }} />
        <div className="cb-skeleton" style={{ height: '11px', width: '28%' }} />
      </div>
    </div>
  )
}
