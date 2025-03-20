export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string; // eslint-disable-line @typescript-eslint/naming-convention
  msg: string;
}
