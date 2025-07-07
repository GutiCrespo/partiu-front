"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import { AuthService } from "@/services/AuthService";
import { setCookie, removeCookie, getCookie } from "@/helpers/cookies";
import { useAuthContext } from "@/contexts/auth";


export const useAuthLogic = () => {
  const router = useRouter();

  const { userInfo, isLoggedIn, setUserInfo, setIsLoggedIn, isLoadingAuth, setIsLoadingAuth } = useAuthContext()
  const logout = useCallback(() => {
    setUserInfo(null);
    setIsLoggedIn(false);
    removeCookie("authToken");
    toast.info("Você foi desconectado.");
    router.push("/login");
  }, [setUserInfo, setIsLoggedIn, router])

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
      setIsLoggedIn(true)
      toast.success(`Bem-vindo, ${response.name || response.email}!`);
      console.log(`Bem-vindo, ${response.name || response.email}!`);
      router.push("/");
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Credenciais inválidas. Tente novamente.");
      logout();
    }
  };

  // Função de registro
  const register = async (email: string, password: string) => {
    try {
      const response = await AuthService.register(email, password);

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
      console.log("Cadastro realizado com sucesso");
      
      router.push("/");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Erro ao cadastrar. O e-mail pode já estar em uso.");
      logout();
    }
  };

  useEffect(() => {
    const verifyAuthOnLoad = async () => {

      setIsLoadingAuth(true)
      const authToken = getCookie("authToken");
      
      if (authToken) {
        try {
          const userData = await AuthService.verifyToken(authToken);
          setUserInfo(userData);
          setIsLoggedIn(true);
        } catch (error: any) {
          console.error("Erro ao verificar token na inicialização:", error);
          toast.error(error.message || "Sessão expirada ou inválida. Por favor, faça login novamente.");
          logout();
        }
      } else {
        setUserInfo(null)
        setIsLoggedIn(false)
      }
      setIsLoadingAuth(false)
    };

    if (isLoadingAuth || (!isLoggedIn && userInfo === null && getCookie("authToken"))) {
        verifyAuthOnLoad();
    }
  }, [logout, setUserInfo, setIsLoggedIn, setIsLoadingAuth, isLoadingAuth, isLoggedIn, userInfo])

  return {
    userInfo,
    isLoggedIn,
    login,
    register,
    logout,
  };
};