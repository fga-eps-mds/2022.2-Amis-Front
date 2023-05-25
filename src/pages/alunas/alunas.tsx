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
import { toast } from 'react-toastify';
import { Typography } from "@mui/material";
import CPFMask from "../../shared/components/Masks/ValueMask";

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

export function Alunas() {
  const [open, setOpen] = useState(false);
  const [aluna, setAluna] = useState(Object);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
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
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;


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

  function transformDate(date: any) {
    const parts = date.split('/');
    const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return transformedDate;
  }

  const cadastrarAlunas = async (data: any) => {

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


    const cpfEhValido = validarCPF(aluna.cpf);
    if (cpfEhValido === false){
      toast.error("O CPF informado é invalido.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(aluna.email)) {
       toast.error("E-mail inválido.");
       return;
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(aluna.data_nascimento)) {
      toast.error("Formato de data inválido. Use o formato dd/mm/aaaa.");
      return;
    }

    const matchResult = aluna.data_nascimento.match(dateRegex);
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

    if (aluna.nome.length > 70) {
      toast.error("Nome inválido.");
      return;
    }

    if (aluna.login.length < 8) {
      toast.error("Login muito pequeno.");
      return;
    }

    if (aluna.senha.length < 8) {
      toast.error("Senha muito pequena.");
      return;
    }

    if (aluna.senha.length < 8) {
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



    aluna.cpf = removeSpecialCharacters(aluna.cpf);
    aluna.telefone = removeSpecialCharacters(aluna.telefone);
    aluna.cep = removeSpecialCharacters(aluna.cep);
    aluna.data_nascimento=transformDate(aluna.data_nascimento);

    const response = await cadastraAluna(aluna);
    if (response.status === 201) {
      //console.log("Aluna cadastrada com sucesso!")
      handleClose();
      toast.success("Aluna cadastrada com sucesso!");
    } else {
      //console.log("MENSAGEM NEGATIVA!!")
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
        temp.push({
          id: index, // Adiciona um id único com base no índice
          login: value.login,
          nome: value.nome,
          cpf: value.cpf,
          data_nascimento: value.data_nascimento,
        });
      });
    }
    setDataTable(temp);
  });


  const deleteAlunas = async () => {
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


  const editAlunas = async (data: any) => {
    // eslint-disable-next-line array-callback-return
    const aluna = {
      nome: data.nome,
      login: data.login,
      cpf: data.cpf,
      telefone: data.telefone,
      data_nascimento: data.data_nascimento,
      senha: data.senha,
      email: data.email,
      status: data.status,
      idEndereco: 1,
    } as AlunasCadastrarDTO;

    const response = await editarAluna(id.toString(), aluna);
    if (response.status === 200 || response.status === 204) {
      toast.success("Aluna atualizada com sucesso!");
    } else {
      toast.error("Erro na atualização da aluna.");
    }
    setOpenEdit(false);
    await queryClient.invalidateQueries("listar_alunas");
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
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);
            if (selectedRow) {
              setSelectedAluna((selectedRow as any).login);
              handleOpenConfirmation();
            }
          }}
        />,
      ],
    },
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
        <DataTable data={dataTable} columns={columnsTable} />
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
              <CPFMask label="cpf" />

              <FormControl sx={{ width: '100%', background: '#F5F4FF' }}>
                <InputLabel id="select-deficiencia-label">Possui deficiência?</InputLabel>
                <Select
                  labelId="select-deficiencia-label"
                  id="select-deficiencia"
                  defaultValue={aluna.deficiencia}
                  {...register('deficiencia')}
                  label="Possui deficiência?"
                >
                  <MenuItem value={true as any}>Sim</MenuItem>
                  <MenuItem value={false as any}>Não</MenuItem>
                </Select>
              </FormControl>

              <CPFMask label="data_nascimento" />

              <CPFMask label="telefone" />

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
                label="Descricao Endereco"
                {...register("descricao_endereco")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />

              <CPFMask label="cep" />

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Status (Produção, Curso ou Inativo)
                </InputLabel>
                <Select
                  id="simple-select-label-status"
                  labelId="simple-select-status"
                  label="Status(Produção, Curso ou Inativo)"
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
        <Box sx={style}>
          <FormText>Altere os dados da aluna.</FormText>
          <Form onSubmit={handleSubmit(editAlunas)}>
            <TextField
              id="outlined-nome"
              label="Nome Completo *"
              defaultValue={aluna.nome}
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF *"
              required={true}
              inputProps={{ maxLength: 11 }}
              defaultValue={aluna.cpf}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-data_nascimento"
              label="Data de Nascimento"
              defaultValue={aluna.data_nascimento}
              required={true}
              {...register("data_nascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />

            <TextField
              id="outlined-telefone"
              label="Telefone *"
              defaultValue={aluna.telefone}
              required={true}
              {...register("telefone")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-email"
              label="E-mail"
              {...register("email")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-login"
              label="Login *"
              required={true}
              inputProps={{ maxLength: 120 }}
              defaultValue={aluna.login}
              {...register("login")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-senha"
              label="Senha *"
              defaultValue={aluna.senha}
              required={true}
              {...register("senha")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Status(Produção, Curso ou Inativo)
              </InputLabel>
              <Select
                id="simple-select-label-status"
                labelId="simple-select-status"
                required={true}
                defaultValue={aluna.status}
                label="Status(Produção, Curso ou Inativo)"
                {...register("status")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              >
                <MenuItem value={1 as any}>Produção</MenuItem>
                <MenuItem value={2 as any}>Curso</MenuItem>
                <MenuItem value={3 as any}>Inativo</MenuItem>
              </Select>
            </FormControl>
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
