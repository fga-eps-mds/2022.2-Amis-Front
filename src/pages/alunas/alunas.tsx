import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { queryClient } from "../../services/queryClient";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";

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
} from "@mui/material";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { AlunasListarDTO } from "./dtos/AlunasListar.dto";
import { AlunasCadastrarDTO } from "./dtos/AlunasCadastrar.dto";
import {
  cadastraAluna,
  listaAlunas,
  apagaAluna,
  editaAluna,
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const [id, setId] = useState<GridRowId>(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const cadastrarAlunas = async (data: any) => {
    const aluna = {
      nome: data.nome,
      login: data.login,
      cpf: data.cpf,
      telefone: data.telefone,
      dNascimento: data.dNascimento,
      senha: data.senha,
      
      status: data.status,
      idEndereco: 1,
    } as AlunasCadastrarDTO;

    const response = await cadastraAluna(aluna);
    if (response.status === 201) {
      handleClose();
      toast.success("Aluna cadastrada com sucesso!");
    } else {
      toast.error("Erro ao cadastrar a aluna.");
    }
    await queryClient.invalidateQueries("listar_alunas");
  };

  useQuery("listar_alunas", async () => {
    const response = await listaAlunas();
    const temp: AlunasListarDTO[] = [];
    response.data.forEach((value: AlunasListarDTO) => {
      temp.push({
        id: value.id,
        nome: value.nome,
        cpf: value.cpf,
        dNascimento: value.dNascimento,
      });
    });
    setDataTable(temp);
  });

  const deleteAlunas = async () => {
    const response = await apagaAluna(id.toString());
    if (response.status === 204) {
      toast.success("Aluna excluída com sucesso!");
    } else {
      toast.error("Erro ao excluir a aluna.");
    }
    handleCloseConfirmation();
    await queryClient.invalidateQueries("listar_alunas");
  };

  const editAlunas = async (data: any) => {
    // eslint-disable-next-line array-callback-return
    const aluna = {
      nome: data.nome,
      login: data.login,
      cpf: data.cpf,
      telefone: data.telefone,
      dNascimento: data.dNascimento,
      senha: data.senha,
      email: data.email,
      status: data.status,
      idEndereco: 1,
    } as AlunasCadastrarDTO;

    const response = await editaAluna(id.toString(), aluna);
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
    { field: "dNascimento", headerName: "Data Nascimento", flex: 2 },
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
            {"Você tem certeza que deseja excluir esta aluna?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteAlunas} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText id="cabecalho">
            Preencha corretamente os dados cadastrais.
          </FormText>
          <Form onSubmit={handleSubmit(cadastrarAlunas)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-login"
              label="login"
              {...register("login")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF (apenas números)"
              inputProps={{ maxLength: 11 }}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-telefone"
              label="telefone"
              {...register("telefone")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dNascimento"
              label="Data de Nascimento"
              {...register("dNascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-senha"
              label="senha"
              {...register("senha")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-email"
              label="email"
              {...register("email")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Status(Produção, Curso ou Inativo)
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
            <PrimaryButton text={"Cadastrar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText>Altere os dados da aluna.</FormText>
          <Form onSubmit={handleSubmit(editAlunas)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              defaultValue={aluna.nome}
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-login"
              label="login"
              required={true}
              inputProps={{ maxLength: 120 }}
              defaultValue={aluna.login}
              {...register("login")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF (apenas números)"
              required={true}
              inputProps={{ maxLength: 11 }}
              defaultValue={aluna.cpf}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-telefone"
              label="telefone"
              defaultValue={aluna.telefone}
              required={true}
              {...register("telefone")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dNascimento"
              label="Data de Nascimento"
              defaultValue={aluna.dNascimento}
              required={true}
              {...register("dNascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-senha"
              label="senha"
              defaultValue={aluna.senha}
              required={true}
              {...register("senha")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-email"
              label="email"
              {...register("email")}
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
