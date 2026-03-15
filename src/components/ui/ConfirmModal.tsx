import { createPortal } from 'react-dom'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}

export function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, isPending }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'var(--cb-overlay)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="w-full animate-fade-in-up"
        style={{
          maxWidth: '400px',
          background: 'var(--cb-surface)',
          border: '1px solid color-mix(in srgb, var(--cb-rose) 30%, var(--cb-border-vis))',
          borderRadius: '1rem',
          padding: '1.75rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'color-mix(in srgb, var(--cb-rose) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--cb-rose) 25%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cb-rose)" strokeWidth="1.75">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 className="font-syne font-bold" style={{ fontSize: '1.0625rem', letterSpacing: '-0.015em', color: 'var(--cb-text)', marginBottom: '0.5rem' }}>
            {title}
          </h2>
          <p className="font-outfit" style={{ fontSize: '0.8125rem', color: 'var(--cb-muted)', lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button
            onClick={onCancel}
            disabled={isPending}
            className="cb-btn-ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="font-outfit font-semibold"
            style={{
              flex: 1,
              padding: '0.5625rem 1rem',
              background: 'var(--cb-rose)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.6 : 1,
              transition: 'opacity 0.15s ease, filter 0.15s ease',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.filter = 'brightness(1.12)' }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
          >
            {isPending ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
