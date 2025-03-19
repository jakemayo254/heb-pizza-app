export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
  access_token: string;
  msg: string;
}
