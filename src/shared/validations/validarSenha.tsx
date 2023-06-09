import { toast } from "react-toastify";

export const validateSenha = (senha: string): boolean => {
    if (senha.length < 8) {
        toast.error("Senha muito pequena.");
        return false;
    }
    return true;
};