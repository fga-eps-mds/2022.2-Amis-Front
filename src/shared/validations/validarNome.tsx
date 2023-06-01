import { toast } from "react-toastify";

export const validateNome = (nome: string): boolean => {
    if (nome.length > 70) {
        toast.error("Nome inválido.");
        return false;
    }
    return true;
};