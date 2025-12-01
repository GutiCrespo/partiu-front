"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import { AuthService } from "@/services/AuthService";
import { setCookie, removeCookie, getCookie } from "@/helpers/cookies";
import { useAuthContext } from "@/contexts/auth";

function getSafeNextFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(window.location.href);
    const next = url.searchParams.get("next");
    if (!next) return null;

    // Só aceita caminhos internos iniciando com "/"
    if (next.startsWith("/") && !next.startsWith("//")) {
      return next;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * (Opcional) Calcula a rota atual para usar em ?next= no logout.
 */
function getCurrentPathWithSearch(): string {
  if (typeof window === "undefined") return "/";
  const { pathname, search } = window.location;
  return pathname + (search || "");
}

export const useAuthLogic = () => {
  const router = useRouter();

  const {
    userInfo,
    isLoggedIn,
    setUserInfo,
    setIsLoggedIn,
    isLoadingAuth,
    setIsLoadingAuth,
  } = useAuthContext();

  const logout = useCallback(() => {
    setUserInfo(null);
    setIsLoggedIn(false);
    removeCookie("authToken");
    toast.info("Você foi desconectado.");

    // Envia a rota atual em ?next= para, após login, retornar onde estava
    const back = getCurrentPathWithSearch();
    router.replace(`/login?next=${encodeURIComponent(back)}`);
  }, [setUserInfo, setIsLoggedIn, router]);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);

      setCookie({
        name: "authToken",
        value: response.token,
        daysToExpire: 30,
      });

      setUserInfo({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        profilePicture: response.profilePicture,
      });
      setIsLoggedIn(true);
      toast.success(`Bem-vindo, ${response.name || response.email}!`);

      // Respeita o ?next= (se não houver, vai para "/")
      const next = getSafeNextFromLocation() || "/";
      router.replace(next);
      router.refresh();
    } catch (error: unknown) {
      console.error("Erro no login:", error);

      const msg =
        error instanceof Error
          ? error.message
          : "Credenciais inválidas. Tente novamente.";

      toast.error(msg);
      // não faz logout aqui
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await AuthService.register(name, email, password);

      setCookie({
        name: "authToken",
        value: response.token,
        daysToExpire: 30,
      });

      setUserInfo({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        profilePicture: response.profilePicture,
      });
      setIsLoggedIn(true);
      toast.success("Cadastro realizado com sucesso!");

      // Respeita o ?next= também no cadastro
      const next = getSafeNextFromLocation() || "/";
      router.replace(next);
      router.refresh();
    } catch (error: unknown) {
      console.error("Erro no cadastro:", error);

      const msg =
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar. Tente novamente.";

      toast.error(msg);
      // se quiser fazer algo extra (tipo resetar form), faz aqui
    }
  };

  useEffect(() => {
    const verifyAuthOnLoad = async () => {
      setIsLoadingAuth(true);
      const authToken = getCookie("authToken");

      if (authToken) {
        try {
          const userData = await AuthService.verifyToken(authToken);
          setUserInfo(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Erro ao verificar token na inicialização:", error);
          toast.error(
            "Sessão expirada ou inválida. Por favor, faça login novamente."
          );
          logout();
        }
      } else {
        setUserInfo(null);
        setIsLoggedIn(false);
      }
      setIsLoadingAuth(false);
    };

    if (
      isLoadingAuth ||
      (!isLoggedIn && userInfo === null && getCookie("authToken"))
    ) {
      void verifyAuthOnLoad();
    }
  }, [
    logout,
    setUserInfo,
    setIsLoggedIn,
    setIsLoadingAuth,
    isLoadingAuth,
    isLoggedIn,
    userInfo,
  ]);

  return {
    userInfo,
    isLoggedIn,
    login,
    register,
    logout,
  };
};
