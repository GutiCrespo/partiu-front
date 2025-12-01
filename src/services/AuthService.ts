import {
  UserBackendResponse,
  UserLoginResponse,
  UserRegisterResponse,
} from "@/types/api";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const AuthService = {
  async login(email: string, password: string): Promise<UserLoginResponse> {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = "Erro no login.";
      try {
        const errorData = await response.json();
        
        errorMessage = errorData.erro || errorMessage;
      } catch {
        // se não conseguir fazer parse do JSON, mantém mensagem padrão
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<UserRegisterResponse> {
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      let errorMessage = "Erro no cadastro.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.erro || errorMessage;
      } catch {
        // se não conseguir parsear o JSON, mantém mensagem padrão
      }
      throw new Error(errorMessage);
    }

    
    return response.json();
  },

  async verifyToken(authToken: string): Promise<UserBackendResponse> {
    const response = await fetch(`${apiUrl}/users/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Erro ao verificar token.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // se der erro no JSON, mantém mensagem padrão
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
};
