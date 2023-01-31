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
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const registerAssistentes = async (data: any) => {
    const assistente = {
      nome: data.nome,
      cpf: data.cpf,
      login: data.login,
      observacao: data.observacao,
      administrador: data.administrador,
    } as AssistentesCadastrarDTO;

    const response = await cadastrarAssistente(assistente);

    if (response.status === 201) {
      setOpen(false);
      queryClient.invalidateQueries("listar_assistentes");
      toast.success("Assistente cadastrado com sucesso!");
    }
  };

  useQuery("listar_assistentes", async () => {
    const response = await listarAssistentes();

    const temp: AssistentesListarDTO[] = [];
    response.data.forEach((value: AssistentesListarDTO) => {
      temp.push({
        id: value.id,
        nome: value.nome,
        cpf: value.cpf,
        observacao: value.observacao,
        administrador: value.administrador,
        login: value.login,
      });
    });
    setDataTable(temp);
  });

  const deleteAssistentes = async () => {
    const response = await excluirAssistente(id.toString());
    if (response.status === 204) {
      handleCloseConfirmation();
      queryClient.invalidateQueries("listar_assistentes");
      toast.success("Assistente excluído com sucesso!");
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
    setValue("adminEdit", assistente.administrador);
    setOpenEdit(true);
  };

  const editAssistentes = async (data: any) => {
    const assistenteEditada = {
      nome: data.nomeEdit,
      cpf: data.cpfEdit,
      administrador: data.adminEdit,
      login: data.loginEdit,
      observacao: data.observacaoEdit,
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
          <FormText>Preencha corretamente os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(registerAssistentes)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF (apenas números)"
              required={true}
              inputProps={{ maxLength: 11 }}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-login"
              label="Login"
              required={true}
              {...register("login")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-Observações"
              label="Observações"
              {...register("observacao")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <FormControl fullWidth>
              <InputLabel required={true} id="demo-simple-select-label">
                Administrador (a)?
              </InputLabel>
              <Select
                id="simple-select-label-admin"
                labelId="simple-select-admin"
                label="Administrador(a)?"
                required={true}
                defaultValue=""
                {...register("administrador")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              >
                <MenuItem value={false as any}>Não</MenuItem>
                <MenuItem value={true as any}>Sim</MenuItem>
              </Select>
            </FormControl>
            <PrimaryButton text={"Cadastrar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText>Altere os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(editAssistentes)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              required={true}
              {...register("nomeEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF (apenas números)"
              required={true}
              inputProps={{ maxLength: 11 }}
              {...register("cpfEdit")}
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
            <TextField
              id="outlined-observacao"
              label="Observações"
              required={true}
              {...register("observacaoEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Administrador(a)?
              </InputLabel>
              <Select
                id="simple-select-label-admin"
                labelId="simple-select-admin"
                required={true}
                label="Administrador(a)?"
                defaultValue=""
                {...register("adminEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              >
                <MenuItem value={false as any}>Não</MenuItem>
                <MenuItem value={true as any}>Sim</MenuItem>
              </Select>
            </FormControl>
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
