import { AppUser } from '../../../shared/models/app-user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AppUser;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
  user: AppUser;
}
