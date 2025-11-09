"use client";

import { Button } from "@/components/ui/button/index";
import { Input } from "@/components/ui/input";
import { useAuthLogic } from "@/hooks/useAuthLogic";
import { useForm } from "react-hook-form";

type LoginFormData = {
  password: string;
  email: string;
};

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const { login } = useAuthLogic();

  async function onSubmit(data: LoginFormData) {
    await login(data.email, data.password);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
      <div className="input-data flex flex-col w-full gap-2">
        <Input
          {...register("email")}
          labelText="Insira seu e-mail"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="seuemail@email.com"
        />
        <Input
          {...register("password")}
          labelText="Insira sua senha"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="********"
        />
      </div>
      <Button type="submit">Entrar</Button>
    </form>
  );
};
