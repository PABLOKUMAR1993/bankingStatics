export interface AuthResponse {
  token?: string;
  message: string;
  user?: {
    email: string;
    nombreUsuario: string;
  };
}

export interface RegisterRequest {
  email: string;
  nombreUsuario: string;
  contrasenya: string;
}

export interface LoginRequest {
  email: string;
  contrasenya: string;
}