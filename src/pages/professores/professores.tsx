import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { queryClient } from "../../services/queryClient";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import ValueMask from "../../shared/components/Masks/ValueMask";


import {
  Box,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Autocomplete,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { ProfessoresListarDTO } from "./dtos/ProfessoresListar.dto";
import { ProfessoresCadastrarDTO } from "./dtos/ProfessoresCadastrar.dto";
import { useQuery } from "react-query";
import { FormProvider, useForm } from "react-hook-form";
import {
  cadastraProfessor,
  listaProfessores,
  apagaProfessor,
  editaProfessor,
} from "../../services/professores";


import { validateCPF } from "../../shared/validations/validarCPF";
import { validateDate, validateAge } from "../../shared/validations/validarDataNascimento";
import { validateEmail } from "../../shared/validations/validarEmail";
import { validateLogin } from "../../shared/validations/validarLogin";
import { validateSenha } from "../../shared/validations/validarSenha";
import { validateNome } from "../../shared/validations/validarNome";
import removeSpecialCharacters from "../../shared/validations/removeSpecialCharacters";
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

function transformDate(date: any) {
  const parts = date.split('/');
  const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return transformedDate;
}


export function Professores() {
  const [open, setOpen] = useState(false);
  const [professor, setProfessor] = useState(Object);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const [id, setId] = useState<GridRowId>(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProfeesor, setSelectedProfessor] = useState(null);
  const [nextId, setNextId] = useState(1); // Variável de estado para o próximo ID
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const methods = useForm();
  const {
    setValue,
    register,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  


  const cadastrarProfessores = async (data: any) => {

    const professor = {
      senha: data.senha,
      codigo: data.codigo,
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      login: data.login,
      data_nascimento: data.data_nascimento,
      telefone: data.telefone,
      habilidades: data.habilidades,
      //senha_confirmada: data.senha_confirmada,
    } as ProfessoresCadastrarDTO;

    const cpfValido = validateCPF(professor.cpf);
    if (!cpfValido) {
      return;
    }

    const emailValido = validateEmail(professor.email);
    if (!emailValido) {
      return;
    }

    const dateValido = validateDate(professor.data_nascimento);
    if (!dateValido) {
      return;
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    const matchResult = dateRegex.exec(professor.data_nascimento);

    if (!matchResult) {
      toast.error("Data de nascimento inválida.");
      return;
    }
    const [, dia, mes, ano] = matchResult;

    const dataNascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));

    const ageValida = validateAge(dataNascimento);
    if (!ageValida) {
      return;
    }

    const nomeValido = validateNome(professor.nome);
    if (!nomeValido) {
      return;
    }

    const loginValido = validateLogin(professor.login);
    if (!loginValido) {
      return;
    }

    const senhaValida = validateSenha(professor.senha);
    if (!senhaValida) {
      return;
    }

    professor.cpf = removeSpecialCharacters(professor.cpf);
    professor.telefone = removeSpecialCharacters(professor.telefone);
    professor.data_nascimento=transformDate(professor.data_nascimento);

    const response: any = await cadastraProfessor(professor);
    if (response.status === 201) {
      handleClose();
      toast.success("Professor cadastrado com sucesso!");
    } else {
      toast.error("Erro ao cadastrar o professor.");
    }
    await queryClient.invalidateQueries("listar_professores");
  };

  const validatePassword = (value: any) => {
      const password = watch("senha");
      if (value === password) {
        return true;
     }
    return "As senhas não correspondem";
  };

  useQuery("listar_professores", async () => {
    const response = await listaProfessores();
    const temp: ProfessoresListarDTO[] = [];
    response.data.forEach((value: ProfessoresListarDTO, index: number) => {
      const [year, month, day] = value.data_nascimento.split("-");
      const dataFormatada = `${day}/${month}/${year}`;

      temp.push({
        id: index,
        nome: value.nome,
        login: value.login,
        cpf: value.cpf,
        data_nascimento: dataFormatada,
        senha:value.senha,
        codigo:value.codigo,
        email:value.email,
        telefone:value.telefone,
        habilidades:value.habilidades,
      });
    });
    setDataTable(temp);
  });


  const deleteProfessores = async () => {
    const selectedProfessor = dataTable.find((item) => (item as any).id === id); // Encontra o objeto da aluna com base no ID selecionado
    if (selectedProfessor) {
      const login = (selectedProfessor as any).login; // Obtém o login da aluna
      const response = await apagaProfessor(login); // Passa o login para a função apagaAluna
      if (response.status === 204) {
        toast.success("Professor excluído com sucesso!");
      } else {
        toast.error("Erro ao excluir professor.");
      }

      handleCloseConfirmation();
      await queryClient.invalidateQueries("listar_professores");
    }
  };

  const carregarProfessores = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });

    const professor = response as ProfessoresListarDTO;
    
    setProfessor(professor);
    setValue("nomeEdit", professor.nome);
    setValue("cpfEdit", professor.cpf);
    setValue("data_nascimentoEdit", professor.data_nascimento);
    setValue("telefoneEdit", professor.telefone);
    setValue("emailEdit", professor.email);
    setValue("habilidadesEdit",professor.habilidades);
    
    
    setOpenEdit(true);
  };
  
  const editProfesores = async (data: any): Promise<void> => {
    // eslint-disable-next-line array-callback-return
    
    const cpfValido = validateCPF(data.cpfEdit);
    if (!cpfValido) {
      return;
    }
    
    const emailValido = validateEmail(data.emailEdit);
    if (!emailValido) {
      return;
    }
    
    const dateValido = validateDate(data.data_nascimentoEdit);
    if (!dateValido) {
      return;
    }
    
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    const matchResult = dateRegex.exec(data.data_nascimentoEdit);
    
    if (!matchResult) {
      toast.error("Data de nascimento inválida.");
      return;
    }
    const [, dia, mes, ano] = matchResult;
    
    const dataNascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    
    const ageValida = validateAge(dataNascimento);
    if (!ageValida) {
      return;
    }
    
    const nomeValido = validateNome(professor.nome);
    if (!nomeValido) {
      return;
    }
    
    // declarando id que sera editado.
    
    const id=professor.login;
    
    data.data_nascimentoEdit=transformDate(data.data_nascimentoEdit);
    data.cpfEdit = removeSpecialCharacters(data.cpfEdit);
    data.telefoneEdit = removeSpecialCharacters(data.telefoneEdit);
    
    
    const professorEdit = {
      nome: data.nomeEdit,
      cpf: data.cpfEdit,
      login: professor.login,
      email: data.emailEdit,
      data_nascimento: data.data_nascimentoEdit,
      telefone: data.telefoneEdit,
      senha:professor.senha,
      habilidades:data.habilidadesEdit,
    } as ProfessoresCadastrarDTO;
    
    const response = await editaProfessor(id.toString(), professorEdit);
    if (response.status === 200 || response.status === 204) {
      toast.success("Professor atualizado com sucesso!");
    } else {
      toast.error("Erro na atualização do professor.");
    }
    setOpenEdit(false);
    await queryClient.invalidateQueries("listar_professores");
  };

  const columnsTable = [
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <IconButton
          id="meu-grid-actions-cell-item"
            data-testid="teste-editar"
            onClick={async () => {
              carregarProfessores(params.id);
              setId(params.id);
              setOpenEdit(true);
            }}
          >
            <AiFillEdit size={20} />
            <Typography variant="body2"></Typography>
          </IconButton>,

          <IconButton
          data-testid="teste-excluir"
          onClick={() => {
            setId(params.id);
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);
            if (selectedRow) {
              setSelectedProfessor((selectedRow as any).login);
              handleOpenConfirmation();
          }}
          }>
          <BsFillTrashFill size={18} />
          <Typography variant="body2"></Typography>
        </IconButton>,
        // eslint-disable-next-line react/jsx-key
      ],
    },
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "login", headerName: "Login", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 2 },
    { field: "data_nascimento", headerName: "Data Nascimento", flex: 2 },
    
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Professores"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          {/* <PrimaryButton text={"Editar"} /> */}
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTable} />
        <Dialog
          open={openConfirmation}
          onClose={setOpenConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Você tem certeza que deseja excluir este professor?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteProfessores} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(cadastrarProfessores)}>
              <TextField
                id="outlined-nome"
                label="Nome Completo"
                required={true}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              
              <ValueMask label="cpf" />
              
              <ValueMask label="data_nascimento" />
              
              <ValueMask label="telefone" />
              <TextField
                id="outlined-email"
                label="E-mail"
                required={false}
                {...register("email")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-habilidades"
                label="Habilidades"
                required={true}
                {...register("habilidades")}
                sx={{ width: "100%", background: "#F5F4FF" }}
                
              />
              <TextField
                id="outlined-login"
                autoComplete="username"
                required={true}
                label="Login"
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
                  autoComplete="new-password"
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

              <FormControl sx={{ width: "100%", background: "#F5F4FF" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-confirm-password" required={true}>
                  Confirmar senha
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  autoComplete="new-password" // Add this line
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("senha", { validate: validatePassword })}
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
                  <Typography variant="body2" color="error" sx={{ mt: 0.4, mb: -3 }}>
                    Senha não corresponde!
                  </Typography>
                )}
              </FormControl>
              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText>Altere os dados do professor.</FormText>
            <Form onSubmit={handleSubmit(editProfesores)}>
              <TextField
                id="outlined-nome"
                label="Nome"
                {...register("nomeEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <ValueMask label="cpfEdit" />
                
              <ValueMask label="data_nascimentoEdit" />

              <ValueMask label="telefoneEdit" />

              <TextField
                id="outlined-email"
                label="Email"
                required={true}
                {...register("emailEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <PrimaryButton text={"Editar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
    </Container>
  );
}
