import { useState } from "react";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import DataTable from "../../shared/components/TablePagination/tablePagination";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { FormProvider, useForm } from "react-hook-form";
import { AiFillEdit, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import {
  cadastrarAssistente,
  editarAssistente,
  excluirAssistente,
  listarAssistentes,
} from "../../services/assistentes";
import { queryClient } from "../../services/queryClient";
import ValueMask from "../../shared/components/Masks/ValueMask";
import removeSpecialCharacters from "../../shared/validations/removeSpecialCharacters";
import { validateCPF } from "../../shared/validations/validarCPF";
import { validateAge, validateDate } from "../../shared/validations/validarDataNascimento";
import { validateEmail } from "../../shared/validations/validarEmail";
import { validateLogin } from "../../shared/validations/validarLogin";
import { validateNome } from "../../shared/validations/validarNome";
import { validateSenha } from "../../shared/validations/validarSenha";
import { AssistentesCadastrarDTO } from "./dtos/AssistentesCadastrar.dto";
import { AssistentesListarDTO } from "./dtos/AssistentesListar.dto";

import {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
} from '../../shared/components/Style/style';

function transformDate(date: any) {
  const parts = date.split('/');
  const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return transformedDate;
}

const Container = getContainerStyles();
const Content = getContentStyles();
const DivButtons = getDivButtonsStyles();
const Form = getFormStyles();
const FormText = getFormTextStyles();
const style = getInlineStyles();

export function Assistentes() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [assistente, setAssistente] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const methods = useForm();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const registerAssistentes = async (data: any) => {
    const assistente = {
      nome: data.nome,
      cpf: data.cpf,
      //data_nascimento: data.data_nascimento,
      dNascimento: data.data_nascimento,
      telefone: data.telefone,
      email: data.email,
      login: data.login,
      senha: data.senha,
      observacao: data.observacao,
      administrador: true,
    } as AssistentesCadastrarDTO;

    // VALIDAÇÕES

    const cpfValido = (assistente.cpf);
    if (!cpfValido) {
      return;
    }

    const emailValido = validateEmail(assistente.email);
    if (!emailValido) {
      return;
    }

    const dateValido = validateDate(assistente.dNascimento);
    if (!dateValido) {
      return;
    }


    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    const matchResult = dateRegex.exec(assistente.dNascimento);

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

    const nomeValido = validateNome(assistente.nome);
    if (!nomeValido) {
      return;
    }

    const loginValido = validateLogin(assistente.login);
    if (!loginValido) {
      return;
    }

    const senhaValida = validateSenha(assistente.senha);
    if (!senhaValida) {
      return;
    }
    
    assistente.cpf = removeSpecialCharacters(assistente.cpf);
    assistente.telefone = removeSpecialCharacters(assistente.telefone);
    assistente.dNascimento = transformDate(assistente.dNascimento);

    const response: any = await cadastrarAssistente(assistente);

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

    const temp: AssistentesListarDTO[] = [];
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((value: AssistentesListarDTO, index: number) => {
        
        const [year, month, day] = value.dNascimento.split("-");
        const dataFormatada = `${day}/${month}/${year}`;

        temp.push({
          id: index,
          nome: value.nome,
          cpf: value.cpf,
          dNascimento: dataFormatada,
          telefone: value.telefone,
          email: value.email,
          login: value.login,
          observacao: value.observacao,
          administrador: value.administrador,
          senha:value.senha,
        });
      });
    }
    setDataTable(temp);
  });

  const deleteAssistentes = async () => {
    const selectedAssistente = dataTable.find((item) => (item as any).id === id); // Encontra o objeto da assistente com base no ID selecionado
    if (selectedAssistente) {
      const login = (selectedAssistente as any).login; // Obtém o login da assistente
      const response = await excluirAssistente(login); // Passa o login para a função apagaassistente

      if (response.status === 204) {
        toast.success("Assistente excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a Assistente.");
      }

      handleCloseConfirmation();
      await queryClient.invalidateQueries("listar_assistentes");
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
    setValue("data_nascimentoEdit", assistente.dNascimento);
    setValue("telefoneEdit", assistente.telefone);
    setValue("emailEdit", assistente.email);
    setValue("observacaoEdit",assistente.observacao);
    setOpenEdit(true);
  };

  const editAssistentes = async (data: any) => {
    // VALIDAÇÕES

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

    const nomeValido = validateNome(data.nomeEdit);
    if (!nomeValido) {
      return;
    }


    data.cpfEdit = removeSpecialCharacters(data.cpfEdit);
    data.telefoneEdit = removeSpecialCharacters(data.telefoneEdit);
    data.cepEdit = removeSpecialCharacters(data.cepEdit);
    data.data_nascimentoEdit = transformDate(data.data_nascimentoEdit);


    const assistenteEditada = {
      nome: data.nomeEdit,
      cpf: data.cpfEdit,
      dNascimento: data.data_nascimentoEdit,
      telefone: data.telefoneEdit,
      email: data.emailEdit,
      observacao: data.observacaoEdit,
      login: assistente.login,
      administrador:assistente.administrador,
      senha:assistente.senha,
    };

    const response = await editarAssistente(assistente.login, assistenteEditada);
    if (response.status === 200) {
      try {
        await queryClient.invalidateQueries("listar_assistentes");
        setOpenEdit(false);
        toast.success("Assistente editado com sucesso!");
      } catch (error) {
        // Handle the error
        //console.error(error);
      }
    }
  };

  const columnsTable = [
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      getActions: (params: { id: GridRowId }) => [
        <IconButton
          id="meu-grid-actions-cell-item"
          data-testid="teste-editar"
          onClick={async () => {
            carregarAssistentes(params.id);
          }}
        >
          <AiFillEdit size={20} />
          <Typography variant="body2"></Typography>
        </IconButton>,

        <IconButton
          data-testid="teste-excluir"
          onClick={() => {
            setId(params.id);
            handleOpenConfirmation();
          }}
        >
          <BsFillTrashFill size={18} />
          <Typography variant="body2"></Typography>
        </IconButton>,
      ],
    },
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "observacao", headerName: "Observações", flex: 2 },
    {
      field: "administrador",
      headerName: "Administrador(a)",
      flex: 1,
      type: "boolean",
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

              <ValueMask label="cpf" />

              <ValueMask label="data_nascimento" />

              <ValueMask label="telefone" />

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
        <FormProvider
            {...methods}
          >
          <FormText>Altere os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(editAssistentes)}>
            <TextField
              id="outlined-nome"
              label="Nome Completo"
              required={true}
              {...register("nomeEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <ValueMask label="cpfEdit" />
            <ValueMask label="data_nascimentoEdit" />
            <ValueMask label="telefoneEdit" />
            <TextField
              id="outlined-email"
              label="E-mail"
              inputProps={{ maxLength: 11 }}
              {...register("emailEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-observacao"
              label="Observação"
              required={false}
              {...register("observacaoEdit")}
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