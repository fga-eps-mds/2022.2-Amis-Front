import React, { useState } from "react";
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
import * as EmailValidator from 'email-validator';

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

function removeSpecialCharacters(string: any) {
  if (typeof string === "string" || string instanceof String) {
    return string.replace(/[.\\/\\\-() ]/g, "");
  }
  return "";
}

function transformDate(date: any) {
  const parts = date.split('/');
  const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return transformedDate;
}

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
  const [nextId, setNextId] = useState(1); // Variável de estado para o próximo ID
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const methods = useForm<ProfessoresCadastrarDTO>();

  const {
    setValue,
    register,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const selectedCursos = watch("cursos");

  const cadastrarProfessores = async (data: any) => {

    const professor = {
      senha: data.senha,
      codigo: data.codigo,
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      data_nascimento: data.data_nascimento,
      telefone: data.telefone,
      cursos: data.cursos,
      //senha_confirmada: data.senha_confirmada,
    } as ProfessoresCadastrarDTO;

    const cpfEhValido=validarCPF(professor.cpf);

    if(cpfEhValido===false){
      toast.error("CPF inválido.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(professor.email)) {
      toast.error("E-mail inválido.");
      return;
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(professor.data_nascimento)) {
      toast.error("Formato de data inválido. Use o formato dd/mm/aaaa.");
      return;
    }

    const matchResult = professor.data_nascimento.match(dateRegex);
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

    if (professor.nome.length > 70) {
      toast.error("Nome inválido.");
      return;
    }

    if (professor.senha.length < 8) {
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

    professor.cpf = removeSpecialCharacters(professor.cpf);
    
    professor.telefone = removeSpecialCharacters(professor.telefone);

    professor.data_nascimento=transformDate(professor.data_nascimento);

    const response = await cadastraProfessor(professor);
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
      temp.push({
        id: index,
        nome: value.nome,
        cpf: value.cpf,
        data_nascimento: value.data_nascimento,
      });
    });
    setDataTable(temp);
  });


  const deleteProfessores = async () => {
    const response = await apagaProfessor(id.toString());
    if (response.status === 204) {
      toast.success("Professor excluído com sucesso!");
    } else {
      toast.error("Erro ao excluir professor.");
    }
    handleCloseConfirmation();
    await queryClient.invalidateQueries("listar_professores");
  };

  const editProfesores = async (data: ProfessoresCadastrarDTO) => {
    // eslint-disable-next-line array-callback-return
    const professor = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      data_nascimento: data.data_nascimento,
      telefone: data.telefone,
    } as ProfessoresCadastrarDTO;

    const response = await editaProfessor(id.toString(), professor);
    if (response.status === 200 || response.status === 204) {
      toast.success("Professor atualizado com sucesso!");
    } else {
      toast.error("Erro na atualização do professor.");
    }
    setOpenEdit(false);
    await queryClient.invalidateQueries("listar_professores");
  };

  const columnsTable = [
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 2 },
    { field: "data_nascimento", headerName: "Data Nascimento", flex: 2 },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<AiFillEdit size={20} />}
          label="Editar"
          onClick={async () => {
            setId(params.id);
            setOpenEdit(true);
          }}
        />,
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<BsFillTrashFill size={18} />}
          label="Deletar"
          onClick={() => {
            setId(params.id);
            handleOpenConfirmation();
          }}
        />,
      ],
    },
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
                label="Nome"
                required={true}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              {/* <TextField
                id="outlined-cpf"
                label="CPF (apenas números)"
                inputProps={{ maxLength: 11 }}
                required={true}
                {...register("cpf")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              /> */}
              <ValueMask label="cpf" />
              {/* <TextField
                id="outlined-data_nascimento"
                label="Data de Nascimento"
                required={true}
                {...register("data_nascimento")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              /> */}
              <ValueMask label="data_nascimento" />
              {/* <TextField
                id="outlined-telefone"
                label="Telefone"
                defaultValue={professor.telefone}
                required={true}
                {...register("telefone")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              /> */}
              <ValueMask label="telefone" />
              <TextField
                id="outlined-email"
                label="Email"
                defaultValue={professor.email}
                required={false}
                {...register("email")}
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
              <Autocomplete
                multiple
                disablePortal
                id="outlined-cursos"
                options={["curso 1", "curso 2", "curso 3"]}
                sx={{ width: "100%", background: "#F5F4FF" }}
                onChange={(event, value) => {
                  setValue("cursos", value.join(",")); // Atualiza o valor do campo "cursos" com o array de opções selecionadas
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Curso"
                    value={Array.isArray(selectedCursos) ? selectedCursos.join(", ") : ""}
                  />
                )}
              />
              <PrimaryButton text={"Cadastrar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText>Altere os dados do professor.</FormText>
          <Form onSubmit={handleSubmit(editProfesores)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              defaultValue={professor.nome}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF (apenas números)"
              inputProps={{ maxLength: 11 }}
              defaultValue={professor.cpf}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-data_nascimento"
              label="Data de Nascimento"
              {...register("data_nascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-telefone"
              label="Telefone"
              defaultValue={professor.telefone}
              required={true}
              {...register("telefone")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-email"
              label="Email"
              defaultValue={professor.email}
              required={true}
              {...register("email")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <Autocomplete
              multiple
              disablePortal
              id="combo-box-demo"
              options={["curso 1", "curso 2", "curso 3"]}
              sx={{ width: "100%", background: "#F5F4FF" }}
              {...register("cursos")}
              renderInput={(params) => <TextField {...params} label="Curso" />}
            />
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
