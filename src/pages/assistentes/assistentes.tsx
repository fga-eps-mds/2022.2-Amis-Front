/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "react-query";
import { FormProvider, useForm } from "react-hook-form";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  cadastrarAssistente,
  editarAssistente,
  excluirAssistente,
  listarAssistentes,
} from "../../services/assistentes";
import { AssistentesCadastrarDTO } from "./dtos/AssistentesCadastrar.dto";
import { AssistentesListarDTO } from "./dtos/AssistentesListar.dto";
import { queryClient } from "../../services/queryClient";
import CPFMask from "../../shared/components/Masks/ValueMask";
import { Typography } from "@mui/material";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: ${(props) => props.theme.colors.grey};
  display: inline-flex;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DivButtons = styled.div`
  width: 85%;
  display: inline-flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 auto;
  padding-top: 30px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const FormText = styled.h1`
  color: #525252;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  padding-bottom: 25px;
`;

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  padding: "50px",
  height: "85%",
  overflow: "hidden",
  overflowY: "scroll",
};


export function Assistentes() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [assistente, setAssistente] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAssistente, setSelectedAssistente] = useState(null);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const methods = useForm();
  const {
    register,
    trigger,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  function transformDate(date: any) {
    const parts = date.split('/');
    const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return transformedDate;
  }

     // Função para verificar se um CPF é válido
    const validarCPF = (cpf:any) => {
      cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

      // Verifica se o CPF possui 11 dígitos
      if (cpf.length !== 11) {
        return false;
      }

      // Verifica se todos os dígitos são iguais (ex: 11111111111)
      if (/^(\d)\1+$/.test(cpf)) {
        return false;
      }

      // Calcula o primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) {
        remainder = 0;
      }
      if (remainder !== parseInt(cpf.charAt(9))) {
        return false;
      }

      // Calcula o segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) {
        remainder = 0;
      }
      if (remainder !== parseInt(cpf.charAt(10))) {
        return false;
      }

      return true; // CPF válido
    };

    function removeSpecialCharacters(string: any) {
      if (typeof string === 'string' || string instanceof String) {
        return string.replace(/[./\-\(\) ]/g, "");
      }
      return "";
    }

  const registerAssistentes = async (data: any) => {

    const assistente = {
      nome: data.nome,
      cpf: data.cpf,
      data_nascimento: data.data_nascimento,
      dNascimento:data.data_nascimento,
      telefone: data.telefone,
      email: data.email,
      login: data.login,
      senha: data.senha,
      observacao: data.observacao,
      administrador: true,
    } as AssistentesCadastrarDTO;

    ////console.log(assistente.dNascimento);

    const cpfEhValido = validarCPF(assistente.cpf);
    if (cpfEhValido === false){
      toast.error("O CPF informado é invalido.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(assistente.email)) {
       toast.error("E-mail inválido.");
       return;
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(assistente.dNascimento)) {
      toast.error("Formato de data inválido. Use o formato dd/mm/aaaa.");
      return;
    }

    const matchResult = assistente.dNascimento.match(dateRegex);
    if (!matchResult) {
      toast.error("Data de nascimento inválida.");
      return;
    }
    const [, dia, mes, ano] = matchResult;

    const dataNascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));

    if (
      dataNascimento.getFullYear() !== Number(ano) ||
      dataNascimento.getMonth() !== Number(mes) - 1 ||
      dataNascimento.getDate() !== Number(dia)
    ) {
      toast.error("Data de nascimento inválida.");
      return;
    }

    if (assistente.nome.length > 70) {
      toast.error("Nome inválido.");
      return;
    }

    if (assistente.login.length < 8) {
      toast.error("Login muito pequeno.");
      return;
    }

    if (assistente.senha.length < 8) {
      toast.error("Senha muito pequena.");
      return;
    }

    if (assistente.senha.length < 8) {
      toast.error("Senha muito pequena.");
      return;
    }

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
      return;
    }



    assistente.cpf=removeSpecialCharacters(assistente.cpf);
    assistente.telefone = removeSpecialCharacters(assistente.telefone);
    assistente.dNascimento = transformDate(assistente.dNascimento);

    //console.log(assistente.dNascimento);

    const response = await cadastrarAssistente(assistente);

    if (response.status === 201) {
      setOpen(false);
      queryClient.invalidateQueries("listar_assistentes");
      toast.success("Assistente cadastrado com sucesso!");
    }
  };

  const validatePassword = (value: any) => {
    const password = watch("senha"); // Obtém o valor do campo de senha
    if (value === password) {
      return true; // A senha e a confirmação de senha são iguais, a validação é bem-sucedida
    }
    return "As senhas não correspondem"; // A senha e a confirmação de senha não são iguais, a validação falhou
  };

  useQuery("listar_assistentes", async () => {
    const response = await listarAssistentes();

    //console.log(response.data)
    const temp: AssistentesListarDTO[] = [];
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((value: AssistentesListarDTO, index: number) => {
        temp.push({
          id: index,
          nome: value.nome,
          cpf: value.cpf,
          dNascimento: value.dNascimento,
          telefone: value.telefone,
          email: value.email,
          login: value.login,
          observacao: value.observacao,
          administrador: value.administrador
        });
      });
    } else {
      //console.error("Invalid response data:", response.data);
      // Handle the error or provide a default value for `temp`
    }
    setDataTable(temp);
  });

  const deleteAssistentes = async () => {
    const selectedAssistente = dataTable.find((item) => (item as any).id === id); // Encontra o objeto da aluna com base no ID selecionado
    if (selectedAssistente) {
      const login = (selectedAssistente as any).login; // Obtém o login da aluna
      const response = await excluirAssistente(login); // Passa o login para a função apagaAluna

      if (response.status === 204) {
        toast.success("Assistente excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a Assistente.");
      }

      handleCloseConfirmation();
      await queryClient.invalidateQueries("listar_assistente");
    }
  };

  const carregarAssistentes = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });
    const assistente = response as AssistentesListarDTO;
    setAssistente(assistente);
    setValue("nomeEdit", assistente.nome);
    setValue("cpfEdit", assistente.cpf);
    setValue("dNascimento", assistente.dNascimento);
    setValue("telefone", assistente.telefone);
    setValue("email", assistente.email);
    setOpenEdit(true);
  };

  const editAssistentes = async (data: any) => {
    const assistenteEditada = {
      nome: data.nomeEdit,
      cpf: data.cpfEdit,
      dNascimento: data.dataNascimentoEdit,
      telefone: data.telefoneEdit,
      email: data.emailEdit,
      login: data.loginEdit,
      observacao: data.observacao
    };

    const response = await editarAssistente(assistente.id, assistenteEditada);
    if (response.status === 200) {
      queryClient.invalidateQueries("listar_assistentes");
      setOpenEdit(false);
      toast.success("Assistente editado com sucesso!");
    }
  };

  const columnsTable = [
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "observacao", headerName: "Observações", flex: 2 },
    {
      field: "administrador",
      headerName: "Administrador(a)",
      flex: 1,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      getActions: (params: { id: GridRowId }) => [
        <GridActionsCellItem
          icon={<BsFillTrashFill size={18} />}
          label="Deletar"
          onClick={() => {
            setId(params.id);
            handleOpenConfirmation();
          }}
        />,
        <GridActionsCellItem
          icon={<AiFillEdit size={20} />}
          label="Editar"
          onClick={async () => {
            carregarAssistentes(params.id);
          }}
        />,
      ],
    },
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Assistentes"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTable} />
        <Dialog
          open={openConfirmation}
          onClose={setOpenConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Você tem certeza que deseja excluir?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteAssistentes} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormProvider
            {...methods}
          >
            <FormText>Preencha corretamente os dados cadastrais.</FormText>
            <Form onSubmit={handleSubmit(registerAssistentes)}>
              <TextField
                id="outlined-nome"
                label="Nome Completo"
                required={true}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />

              <CPFMask label="cpf" />

              <CPFMask label="data_nascimento" />

              <CPFMask label="telefone" />

              <TextField
                id="outlined-email"
                label="E-mail"
                inputProps={{ maxLength: 100 }}
                {...register("email")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-login"
                label="Login"
                required={true}
                {...register("login")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <FormControl
                sx={{ width: "100%", background: "#F5F4FF" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password" required={true}>
                  Senha
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  {...register("senha")}
                  endAdornment={
                    <InputAdornment position="end">
                      {showPassword ? (
                        <AiFillEyeInvisible
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                          cursor="pointer"
                          size={20}
                        />
                      ) : (
                        <AiFillEye
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                          cursor="pointer"
                          size={20}
                        />
                      )}
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <FormControl
                sx={{ width: "100%", background: "#F5F4FF" }}
                variant="outlined"
              >
                <InputLabel
                  htmlFor="outlined-adornment-confirm-password"
                  required={true}
                >
                  Confirmar senha
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("senha_confirmada", { validate: validatePassword })}
                  endAdornment={
                    <InputAdornment position="end">
                      {showConfirmPassword ? (
                        <AiFillEyeInvisible
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                          cursor="pointer"
                          size={20}
                        />
                      ) : (
                        <AiFillEye
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                          cursor="pointer"
                          size={20}
                        />
                      )}
                    </InputAdornment>
                  }
                  label="Password********"
                />
                {errors.senha_confirmada && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1, mb: -3.5 }}
                  >
                    Senha não corresponde!
                  </Typography>
                )}
              </FormControl>
              <TextField
                id="outlined-observacao"
                label="Observação"
                required={false}
                {...register("observacao")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText>Altere os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(editAssistentes)}>
            <TextField
              id="outlined-nome"
              label="Nome Completo"
              required={true}
              {...register("nomeEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
              required={true}
              inputProps={{ maxLength: 11 }}
              {...register("cpfEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dataNascimento"
              label="Data de Nascimento"
              required={true}
              inputProps={{ maxLength: 11 }}
              {...register("nascimentoEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-telefone"
              label="Telefone"
              required={true}
              inputProps={{ maxLength: 11 }}
              {...register("telefoneEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-email"
              label="E-mail"
              inputProps={{ maxLength: 11 }}
              {...register("emailEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-login"
              label="Login"
              required={true}
              inputProps={{ maxLength: 120 }}
              {...register("loginEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>


    </Container>
  );
}