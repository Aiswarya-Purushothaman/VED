export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RefreshJwtPayload extends JwtPayload {
  tokenType: 'refresh';
}
