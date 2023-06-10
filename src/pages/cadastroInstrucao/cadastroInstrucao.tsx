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
import { InstrucoesListarDTO } from "./dtos/InstrucoesListar.dto";
import { InstrucoesCadastrarDTO } from "./dtos/InstrucoesCadastrar.dto";
// import {
//   cadastrarInstrucao,
//   listarInstrucoes,
//   excluirInstrucao,
//   editarInstrucao,
// } from "../../services/instrucoes";

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

export function CadastroInstrucao() {

  const [open, setOpen] = useState(false);
  const [instrucao,setInstrucao] = useState(Object);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState<Object[]>([]);
  const [id, setId] = useState<GridRowId>(0);
  const [selectedInstrucao, setSelectedInstrucao] = useState(null);
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

  const cadastrarInstrucoes = async (data: any): Promise<void> => {

    // VALIDAÇÕES

    const nomeValido = validateNome(instrucao.nome);
    if (!nomeValido) {
      return;
    }

    const loginValido = validateLogin(instrucao.login);
    if (!loginValido) {
      return;
    }

    const senhaValida = validateSenha(instrucao.senha);
    if (!senhaValida) {
      return;
    }


    instrucao.cpf = removeSpecialCharacters(instrucao.cpf);
    instrucao.telefone = removeSpecialCharacters(instrucao.telefone);
    instrucao.cep = removeSpecialCharacters(instrucao.cep);
    instrucao.data_nascimento = transformDate(instrucao.data_nascimento);

    // const response: any = await cadastrarInstrucao(instrucao);
    // if (response.status === 201) {
    //   handleClose();
    //   toast.success("Instrução cadastrada com sucesso!");
    // } else {
    //   toast.error("Erro ao cadastrar a instrucao.");
    // }
    // await queryClient.invalidateQueries("listar_instrucoes");
  };

  useQuery("listar_instrucoes", async () => {

    // const response = await listarInstrucoes();

    // const temp: InstrucoesListarDTO[] = [];
    // if (response.data && Array.isArray(response.data)) {
    //   response.data.forEach((value: InstrucoesListarDTO, index: number) => {
    //     temp.push({
    //       id: index, // Adiciona um id único com base no índice
    //       nome: value.nome,
    //       curso: value.curso,
    //       instrucao:value.instrucao,
    //     });
    //   });
    // }
    // setDataTable(temp);
  });


  const deleteInstrucao = async (): Promise<void> => {
    const selectedInstrucao = dataTable.find((item) => (item as any).id === id); // Encontra o objeto da instrucao com base no ID selecionado
    // if (selectedInstrucao) {
    //   const login = (selectedInstrucao as any).login; // Obtém o login da instrucao
    //   const response = await excluirInstrucao(login); // Passa o login para a função apagaInstrucao
    //   if (response.status === 204) {
    //     toast.success("Instrucao excluída com sucesso!");
    //   } else {
    //     toast.error("Erro ao excluir a instucao.");
    //   }

    //   handleCloseConfirmation();
    //   await queryClient.invalidateQueries("listar_instrucoes");
    // }
  };

  const carregarInstrucoes = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });

  };


  const editInstrucoes = async (data: any): Promise<void> => {
    // VALIDAÇÕES

    const nomeValido = validateNome(data.nomeEdit);
    if (!nomeValido) {
      return;
    }
    
    const instrucaoEditada = {
      nome: data.nomeEdit,
      login: instrucao.login,
      curso: data.cursoEdit,
      instrucao: data.instrucaoEdit,
      
    } as InstrucoesCadastrarDTO;


    // const response = await editarInstrucao(instrucao.login, instrucaoEditada);
    //   if (response.status === 200 || response.status === 204) {
    //     toast.success("Instrução atualizada com sucesso!");
    //   } else {
    //     toast.error("Erro na atualização da instrução.");
    //   }
    //   setOpenEdit(false);
    //   await queryClient.invalidateQueries("listar_instrucoes");
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Cadastro de Instrução"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          {/* <PrimaryButton text={"Editar"} /> */}
        </DivButtons>
        <section style={{ margin: '100px', display: 'flex', gap: '90px'}}>
          <div style={{ backgroundColor: 'white', flex: '1', width: '50%',  padding: '30px', borderRadius: '10px'}}>
            <div style={{ justifyContent: "space-between", display: 'flex', paddingBottom: '20px'}}>
              <span>Receitas 1</span>
              <span style={{ color: 'red' }}> Turma 1</span>
            </div>
            <span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius sed pharetra dictum neque massa congue </span>
          </div>

          <div style={{ backgroundColor: 'white', flex: '1', width: '50%',  padding: '30px', borderRadius: '10px'}}>
            <div style={{ justifyContent: "space-between", display: 'flex', paddingBottom: '20px'}}>
              <span>Receitas 1</span>
              <span style={{ color: 'red' }}> Turma 1</span>
            </div>
            <span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius sed pharetra dictum neque massa congue </span>
          </div>
        </section>
        {/* <Dialog
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
        </Dialog> */}
      </Content>
      {/* <Modal open={open} onClose={handleClose} aria-label="Modal de Cadastro">
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
      </Modal> */}

      {/* <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
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
      </Modal>*/}
    </Container>
  );
}
