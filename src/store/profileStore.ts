import { create } from 'zustand'

interface ProfileState {
  username: string | null
  full_name: string | null
  avatar_url: string | null
  setProfile: (p: { username: string; full_name: string; avatar_url?: string | null }) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()((set) => ({
  username: null,
  full_name: null,
  avatar_url: null,
  setProfile: ({ username, full_name, avatar_url }) =>
    set({ username, full_name, avatar_url: avatar_url ?? null }),
  clearProfile: () => set({ username: null, full_name: null, avatar_url: null }),
}))
