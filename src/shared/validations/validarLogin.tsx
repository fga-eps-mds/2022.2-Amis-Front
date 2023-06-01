import { toast } from "react-toastify";

export const validateLogin = (login: string): boolean => {
    if (login.length < 8) {
        toast.error("Login muito pequeno.");
        return false;
    }
    return true;
};