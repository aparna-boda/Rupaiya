const TOKEN_KEY = 'rupaiya_admin_token';
const EXPIRES_KEY = 'rupaiya_admin_expires';

export function getAdminToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expires = sessionStorage.getItem(EXPIRES_KEY);
  if (!token || !expires) return null;
  if (new Date(expires) < new Date()) {
    clearAdminSession();
    return null;
  }
  return token;
}

export function setAdminSession(token: string, expiresAt: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EXPIRES_KEY, expiresAt);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
}

export function isAdminAuthenticated(): boolean {
  return getAdminToken() !== null;
}
