import { Avatar } from '../../../components/ui/Avatar'
import { useMemberProfiles } from '../../profile/hooks/useProfileById'

const MAX_VISIBLE = 5

interface Props {
  userIds: string[]
  currentUserId: string | null
}

export function PresenceBar({ userIds, currentUserId }: Props) {
  const { profileMap, isLoading } = useMemberProfiles(userIds)
  if (isLoading || userIds.length === 0) return null

  const visible  = userIds.slice(0, MAX_VISIBLE)
  const overflow = userIds.length - MAX_VISIBLE

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((uid, i) => {
        const p    = profileMap[uid]
        const name = p?.full_name ?? p?.username ?? uid
        return (
          <div
            key={uid}
            title={uid === currentUserId ? `${name} (you)` : name}
            style={{
              marginLeft: i === 0 ? 0 : '-6px',
              borderRadius: '50%',
              outline: '2px solid var(--cb-bg)',
              zIndex: MAX_VISIBLE - i,
              position: 'relative',
              opacity: uid === currentUserId ? 0.6 : 1,
            }}
          >
            <Avatar name={name} avatarUrl={p?.avatar_url} size="sm" />
          </div>
        )
      })}
      {overflow > 0 && (
        <div style={{
          marginLeft: '-6px',
          width: 26, height: 26,
          borderRadius: '50%',
          background: 'var(--cb-surface2)',
          border: '1px solid var(--cb-border-sub)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.625rem',
          color: 'var(--cb-dim)',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          zIndex: 0,
          position: 'relative',
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}
