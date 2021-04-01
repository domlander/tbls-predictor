export function generateDefaultUsername(email: string) {
  return email.split('@')[0].substring(0, 10)
}