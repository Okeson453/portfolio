// User authentication types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerified: Date | null;
  twoFactorEnabled: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResult {
  success: boolean;
  needs2FA?: boolean;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
}

export interface DeviceInfo {
  id: string;
  userAgent: string;
  ip: string;
  lastActive: Date;
  createdAt: Date;
  isCurrent?: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  recoveryCodes: string[];
}

export interface SessionPayload {
  userId: string;
  role?: string;
  permissions?: string[];
  twoFactorVerified?: boolean;
  iat: number;
  exp: number;
}
