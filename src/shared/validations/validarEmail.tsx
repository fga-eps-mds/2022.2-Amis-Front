import * as EmailValidator from 'email-validator';
import { toast } from "react-toastify";

export const validateEmail = (email: string): boolean => {
    const emailValido = EmailValidator.validate(email);
    if (!emailValido) {
        toast.error("O e-mail informado é inválido.");
        return false;
    }
    return true;
};