import { request } from "http";

export interface UserBackendResponse {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  profilePicture: string | null;
}

export interface UserLoginResponse extends UserBackendResponse {
  token: string;
}

export interface UserRegisterResponse extends UserBackendResponse {
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserVerifyTokenResponse extends UserBackendResponse {
    // Deixei aqui pronto para, caso queiramos mais infos do login na mesma request, a gente só chame aqui
}