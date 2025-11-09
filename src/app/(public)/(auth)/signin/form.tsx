"use client";

import { Button } from "@/components/ui/button/index";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuthLogic } from "@/hooks/useAuthLogic";
import { toast } from "react-toastify";

type RegisterFormData = {
  phone: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignInForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const { register: authRegister } = useAuthLogic();

  const password = watch("password");

  async function onSubmit(data: RegisterFormData) {
    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    await authRegister(data.name, data.email, data.password);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
      <div className="input-data flex flex-col w-full gap-2">
        <Input {...register("name")} labelText="Qual seu nome?" type="name" name="name" autoComplete="name" required placeholder="João da Silva" />
        <Input {...register("email")} labelText="Insira seu e-mail" type="email" name="email" autoComplete="email" required placeholder="seuemail@email.com" />
        <Input {...register("password")} labelText="Insira sua Senha" type="password" name="password" autoComplete="new-password" required minLength={8} placeholder="********" />
        <Input {...register("confirmPassword")} labelText="Confirme sua Senha" type="password" name="confirmPassword" autoComplete="new-password" required minLength={8} placeholder="********" />
      </div>
      <Button type="submit">Cadastrar</Button>
    </form>
  );
};
