import { toast } from "react-toastify";

export const validateDate = (date: string): boolean => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) {
        toast.error("Formato de data inválido. Use o formato dd/mm/aaaa.");
        return false;
    }
    const matchResult = dateRegex.exec(date);

    if (!matchResult) {
        toast.error("Data de nascimento inválida.");
        return false;
    }
    const [, dia, mes, ano] = matchResult;
    const dataNascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    if (
        dataNascimento.getFullYear() !== Number(ano) ||
        dataNascimento.getMonth() !== Number(mes) - 1 ||
        dataNascimento.getDate() !== Number(dia)
    ) {
        toast.error("Data de nascimento inválida.");
        return false;
    }
    return true;
};

export const validateAge = (dataNascimento: Date): boolean => {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataNascimento.getMonth();
    if (
        mesAtual < mesNascimento ||
        (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())
    ) {
        idade--;
    }
    if (idade < 18) {
        toast.error("É necessário ter mais de 18 anos para este cadastro.");
        return false;
    }
    return true;
};