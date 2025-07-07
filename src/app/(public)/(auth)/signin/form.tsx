import { Button } from "@/components/ui/button/index";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuthLogic } from "@/hooks/useAuthLogic";
import { toast } from "react-toastify";


type RegisterFormData = {
  phone: number;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignInForm = () => {

    // const [formData, setFormData] = useState<RegisterFormData>

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
    const { register: authRegister } = useAuthLogic();

    const password = watch("password")

    async function onSubmit(data: RegisterFormData) {
        if (data.password !== data.confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }
        await authRegister(data.email, data.password);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
            <div className="input-data flex flex-col w-full gap-2">
                {/* <Input {...register("phone")} labelText="Insira seu telefone aqui" type="tel" name="phone" autoComplete="phone" required placeholder="Telefone"/> */}
                <Input {...register("email")} labelText="Insira seu e-mail" type="email" name="email" autoComplete="email" required placeholder="seuemail@email.com"/>
                <Input {...register("password")} labelText="Insira sua Senha" type="password" name="password" autoComplete="current-password" required minLength={8} placeholder="********"/>
                <Input {...register("confirmPassword")} labelText="Confirme sua Senha" type="password" name="confirmPassword" autoComplete="current-password" required minLength={8} placeholder="********"/>
            </div>
            <Button type="submit">Cadastrar</Button>
        </form>
    );
}