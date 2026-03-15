export interface Profile {
  user_id: string
  username: string
  full_name: string
  avatar_url: string | null
  preferences?: { theme: string; language: string; email_notifications: boolean }[]
}

export interface CreateProfileRequest {
  username: string
  full_name: string
  avatar_url?: string
}
