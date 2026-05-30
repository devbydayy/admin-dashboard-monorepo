export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  lastActive?: string;
  avatar?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatar?: string;
}