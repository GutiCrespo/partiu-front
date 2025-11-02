import {
  UserBackendResponse,
  UserLoginResponse,
  UserRegisterResponse,
} from "@/types/api";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

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
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.erro || "Erro no login.");
    }

    return response.json();
  },

  async register(name: string, email: string, password: string): Promise<UserRegisterResponse> {
    
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || "Erro no cadastro.");
    }
    
    console.log("Registrado com sucesso.");
    return response.json();
  },

  async verifyToken(authToken: string): Promise<UserBackendResponse> {
    const response = await fetch(`${apiUrl}/users/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao verificar token.");
    }

    return response.json();
  },
};