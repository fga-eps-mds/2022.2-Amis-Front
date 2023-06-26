import React, { useState } from "react";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { queryClient } from "../../services/queryClient";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from 'react-toastify';
import ValueMask from "../../shared/components/Masks/ValueMask";
import * as EmailValidator from 'email-validator';
import removeSpecialCharacters from "../../shared/validations/removeSpecialCharacters";
import { validateCPF } from "../../shared/validations/validarCPF";
import { validateAge, validateDate } from "../../shared/validations/validarDataNascimento";
import { validateEmail } from "../../shared/validations/validarEmail";
import { validateLogin } from "../../shared/validations/validarLogin";
import { validateNome } from "../../shared/validations/validarNome";
import { validateSenha } from "../../shared/validations/validarSenha";

import {
  Box,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

import { useQuery } from "react-query";
import { useForm, FormProvider } from 'react-hook-form';
import { AlunasListarDTO } from "./dtos/AlunasListar.dto";
import { AlunasCadastrarDTO } from "./dtos/AlunasCadastrar.dto";
import {
  cadastraAluna,
  listarAlunas,
  excluirAluna,
  editarAluna,
} from "../../services/alunas";

import {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
} from '../../shared/components/Style/style';


const Container = getContainerStyles();
const Content = getContentStyles();
const DivButtons = getDivButtonsStyles();
const Form = getFormStyles();
const FormText = getFormTextStyles();
const style = getInlineStyles();

export function Alunas() {

  const [open, setOpen] = useState(false);
  const [aluna,setAluna] = useState(Object);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState<Object[]>([]);
  const [id, setId] = useState<GridRowId>(0);
  const [selectedAluna, setSelectedAluna] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);

  const methods = useForm();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  function transformDate(date: any) {
    const parts = date.split('/');
    const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return transformedDate;
  }

  const cadastrarAlunas = async (data: any): Promise<void> => {

    const aluna = {
      nome: data.nome,
      login: data.login,
      cpf: data.cpf,
      telefone: data.telefone,
      data_nascimento: data.data_nascimento,
      senha: data.senha,
      bairro: data.bairro,
      cidade: data.cidade,
      cep: data.cep,
      descricao_endereco: data.descricao_endereco,
      deficiencia: data.deficiencia,
      status: data.status,
      email: data.email,
      idEndereco: 1,
    } as AlunasCadastrarDTO;

    // VALIDAÇÕES

    const cpfValido = validateCPF(aluna.cpf);
    if (!cpfValido) {
      return;
    }

    const emailValido = validateEmail(aluna.email);
    if (!emailValido) {
      return;
    }

    const dateValido = validateDate(aluna.data_nascimento);
    if (!dateValido) {
      return;
    }


    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    const matchResult = dateRegex.exec(aluna.data_nascimento);

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

    const nomeValido = validateNome(aluna.nome);
    if (!nomeValido) {
      return;
    }

    const loginValido = validateLogin(aluna.login);
    if (!loginValido) {
      return;
    }

    const senhaValida = validateSenha(aluna.senha);
    if (!senhaValida) {
      return;
    }


    aluna.cpf = removeSpecialCharacters(aluna.cpf);
    aluna.telefone = removeSpecialCharacters(aluna.telefone);
    aluna.cep = removeSpecialCharacters(aluna.cep);
    aluna.data_nascimento = transformDate(aluna.data_nascimento);

    const response: any = await cadastraAluna(aluna);
    if (response.status === 201) {
      handleClose();
      toast.success("Aluna cadastrada com sucesso!");
    } else {
      toast.error("Erro ao cadastrar a aluna.");
    }
    await queryClient.invalidateQueries("listar_alunas");
  };

  const validatePassword = (value: any) => {
    const password = watch("senha"); // Obtém o valor do campo de senha
    if (value === password) {
      return true; // A senha e a confirmação de senha são iguais, a validação é bem-sucedida
    }
    return "As senhas não correspondem"; // A senha e a confirmação de senha não são iguais, a validação falhou
  };

  useQuery("listar_alunas", async () => {

    const response = await listarAlunas();

    const temp: AlunasListarDTO[] = [];
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((value: AlunasListarDTO, index: number) => {
         
        const [year, month, day] = value.data_nascimento.split("-");
        const dataFormatada = `${day}/${month}/${year}`;
    
        temp.push({
          id: index, // Adiciona um id único com base no índice
          login: value.login,
          nome: value.nome,
          cpf: value.cpf,
          data_nascimento:dataFormatada,
          telefone:value.telefone,
          email:value.email,
          status:value.status,
          deficiencia:value.deficiencia,
          bairro:value.bairro,
          cidade:value.cidade,
          cep:value.cep,
          descricao_endereco:value.descricao_endereco,
          senha:value.senha,
        });
      });
    }
    setDataTable(temp);
  });


  const deleteAlunas = async (): Promise<void> => {
    const selectedAluna = dataTable.find((item) => (item as any).id === id); // Encontra o objeto da aluna com base no ID selecionado
    if (selectedAluna) {
      const login = (selectedAluna as any).login; // Obtém o login da aluna
      const response = await excluirAluna(login); // Passa o login para a função apagaAluna
      if (response.status === 204) {
        toast.success("Aluna excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a aluna.");
      }

      handleCloseConfirmation();
      await queryClient.invalidateQueries("listar_alunas");
    }
  };

  const carregarAlunas = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });

    const aluna = response as AlunasListarDTO;

    setAluna(aluna);
    setValue("nomeEdit", aluna.nome);
    setValue("cpfEdit", aluna.cpf);
    setValue("data_nascimentoEdit", aluna.data_nascimento);
    setValue("deficienciaEdit",aluna.deficiencia);
    setValue("telefoneEdit", aluna.telefone);
    setValue("emailEdit", aluna.email);
    setValue("bairroEdit",aluna.bairro);
    setValue("cidadeEdit",aluna.cidade);
    setValue("descricao_enderecoEdit",aluna.descricao_endereco);
    setValue("cepEdit",aluna.cep);
    setValue("statusEdit",aluna.status);
    
    setOpenEdit(true);
  };


  const editAlunas = async (data: any): Promise<void> => {
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

    
    const alunaEditada = {
      nome: data.nomeEdit,
      login: aluna.login,
      cpf: data.cpfEdit,
      telefone: data.telefoneEdit,
      data_nascimento: data.data_nascimentoEdit,
      senha: aluna.senha,
      deficiencia: data.deficienciaEdit,
      descricao_endereco: data.descricao_enderecoEdit,
      email: data.emailEdit,
      status: data.statusEdit,
      bairro: data.bairroEdit,
      cep: data.cepEdit,
      cidade: data.cidadeEdit,
    } as AlunasCadastrarDTO;


    const response = await editarAluna(aluna.login, alunaEditada);
      if (response.status === 200 || response.status === 204) {
        toast.success("Aluna atualizada com sucesso!");
      } else {
        toast.error("Erro na atualização da aluna.");
      }
      setOpenEdit(false);
      await queryClient.invalidateQueries("listar_alunas");
  };



  const columnsTable = [
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      getActions: (params:any) => [
        <IconButton
          id="meu-grid-actions-cell-item"
          data-testid="teste-editar"
          key={params.id}
          onClick={() => {
            carregarAlunas(params.id);
            setId(params.id);
            setOpenEdit(true);
          }}
        >
          <AiFillEdit size={20} />
          <Typography variant="body2"></Typography>
        </IconButton>,

        <IconButton
          key={params.id}
          data-testid="teste-excluir"
          onClick={() => {
            setId(params.id);
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);
            if (selectedRow) {
              setSelectedAluna((selectedRow as any).login);
              handleOpenConfirmation();
            }
          }}
          >
            <BsFillTrashFill size={18}/>
            <Typography variant="body2"></Typography>
        </IconButton>,
      ],
    },
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 2 },
    { field: "data_nascimento", headerName: "Data de Nascimento", flex: 2 },
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Alunas"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          {/* <PrimaryButton text={"Editar"} /> */}
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTable}/>
        <Dialog
          open={openConfirmation}
          onClose={setOpenConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Você tem certeza que deseja excluir a aluna ${selectedAluna}?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteAlunas} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose} aria-label="Modal de Cadastro">
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(cadastrarAlunas)}>
              <TextField
                id="outlined-nome"
                required={true}
                label="Nome Completo"
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <ValueMask label="cpf" />

              <FormControl sx={{ width: '100%', background: '#F5F4FF' }}>
                <InputLabel id="select-deficiencia-label">Possui deficiência?</InputLabel>
                <Select
                  labelId="select-deficiencia-label"
                  id="select-deficiencia"
                  {...register('deficiencia')}
                  label="Possui deficiência?"
                >
                  <MenuItem value={true as any}>Sim</MenuItem>
                  <MenuItem value={false as any}>Não</MenuItem>
                </Select>
              </FormControl>

              <ValueMask label="data_nascimento" />

              <ValueMask label="telefone" />

              <TextField
                id="outlined-email"
                label="E-mail"
                {...register("email")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-login"
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
                <InputLabel htmlFor="outlined-adornment-confirm-password" required={true}>
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
                    sx={{ mt: 0.4, mb: -3 }}
                  >Senha não corresponde!
                  </Typography>
                )}
              </FormControl>
              <TextField
                id="outlined-bairro"
                required={true}
                label="Bairro"
                {...register("bairro")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />

              <TextField
                id="outlined-cidade"
                required={true}
                label="Cidade"
                {...register("cidade")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />

              <TextField
                id="outlined-descricao_endereco"
                required={true}
                label="Descrição do Endereço"
                {...register("descricao_endereco")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />

              <ValueMask label="cep" />

              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" required={true}>
                  Status
                </InputLabel>
                <Select
                  id="simple-select-label-status"
                  labelId="simple-select-status"
                  label="Status"
                  {...register("status")}
                  sx={{ width: "100%", background: "#F5F4FF" }}
                >
                  <MenuItem value={1 as any}>Produção</MenuItem>
                  <MenuItem value={2 as any}>Curso</MenuItem>
                  <MenuItem value={3 as any}>Inativo</MenuItem>
                </Select>
              </FormControl>

              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        {/* comentario */}
        <Box sx={style}>
          <FormProvider {...methods}>
          <FormText>Altere os dados da aluna.</FormText>
          <Form onSubmit={handleSubmit(editAlunas) } >
            <TextField
              id="outlined-nome"
              label="Nome Completo"
              defaultValue={aluna.nome}
              required={true}
              {...register("nomeEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <FormControl sx={{ width: '100%', background: '#F5F4FF' }}>
                <InputLabel id="select-deficiencia-label">Possui deficiência?</InputLabel>
                <Select
                  labelId="select-deficiencia-label"
                  id="select-deficiencia"
                  defaultValue={aluna.deficiencia}
                  {...register('deficienciaEdit')}
                  label="Possui deficiência?"
                >
                  <MenuItem value={true as any}>Sim</MenuItem>
                  <MenuItem value={false as any}>Não</MenuItem>
                </Select>
              </FormControl>
            
            <ValueMask label="cpfEdit" />
            <ValueMask label="data_nascimentoEdit" />
            <ValueMask label="telefoneEdit" />
            <TextField
              id="outlined-email"
              label="E-mail"
              {...register("emailEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-bairro"
              label="Bairro"
              defaultValue={aluna.bairro}
              required={true}
              {...register("bairroEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cidade"
              label="Cidade"
              defaultValue={aluna.cidade}
              required={true}
              {...register("cidadeEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-descricao_endereco"
              label="Descrição do Endereço"
              defaultValue={aluna.descricao_endereco}
              required={true}
              {...register("descricao_enderecoEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <ValueMask label="cepEdit" />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" required={true}>
                  Status
                </InputLabel>
                <Select
                  id="simple-select-label-status"
                  labelId="simple-select-status"
                  label="Status"
                  defaultValue={aluna.status}
                  {...register("statusEdit")}
                  sx={{ width: "100%", background: "#F5F4FF" }}
                >
                  <MenuItem value={1 as any}>Produção</MenuItem>
                  <MenuItem value={2 as any}>Curso</MenuItem>
                  <MenuItem value={3 as any}>Inativo</MenuItem>
                </Select>
              </FormControl>
            <PrimaryButton text={"Editar"} />
          </Form>
          </FormProvider>
        </Box>
      </Modal>
    </Container>
  );
}
