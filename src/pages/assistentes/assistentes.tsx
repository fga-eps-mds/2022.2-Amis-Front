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
import axios from "axios";
import { useForm } from "react-hook-form";
import { AssistentesListarDTO } from "./dtos/AssistentesListarDTO";
import { AssistentesCadastrarDTO } from "./dtos/AssistentesCadastrarDTO";
import dayjs from "dayjs";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

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
    watch,
    formState: { errors },
  } = useForm({});

  const registerAssistentes = async (data: any) => {
    const assistente = {
      id: Math.random(),
      nome: data.nome,
      cpf: data.cpf,
      login: data.login,
      senha: data.senha,
      obs: data.obs,
      admin: data.admin,
      dCriacao: dayjs().format("DD/MM/YYYY"),
    } as unknown as AssistentesCadastrarDTO;

    setDataTable([...dataTable, assistente]);
    console.log(assistente);
    setOpen(false);
    toast.success("Assistente cadastrado com sucesso!");

    // await axios
    //   .post(
    //     "https://amis-service-stg.azurewebsites.net/assistentes/",
    //     assistente
    //   )
    //   .then((response) => {
    //     console.log(response.status);
    //     handleClose();
    //   })
    //   .catch((err) => console.warn(err));
  };

  // useQuery("listar_assistentes", async () => {
  //   const response = await axios.get(
  //     "https://amis-service-stg.azurewebsites.net/assistentes/"
  //   );
  //   const temp: AssistentesListarDTO[] = [];
  //   response.data.forEach((value: AssistentesListarDTO) => {
  //     temp.push({
  //       id: value.id,
  //       nome: value.nome,
  //       obs: value.obs,
  //       admin: value.admin,
  //     });
  //   });
  //   setDataTable(temp);
  // });

  const deleteAssistentes = async () => {
    console.log("Id excluido", id);
    setOpenConfirmation(false);
    // await axios
    //   .delete("https://amis-service-stg.azurewebsites.net/assistentes/", id)
    //   .then((response) => {
    //     console.log(response.data);
    //     handleCloseConfirmation();
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     handleCloseConfirmation();
    //   });
    toast.success("Assistente excluído com sucesso!");
  };

  const editAssistentes = async (data: any) => {
    // eslint-disable-next-line array-callback-return
    dataTable.find((element: any) => {
      if (element.id === id) {
        const assistente = {
          nome: data.nome,
          cpf: data.cpf,
          admin: data.admin,
        };
        element = assistente;
        console.log("assistente", assistente);
        setAssistente(assistente);
        setOpenEdit(false);
      }
    });
    // await axios
    //   .delete("https://amis-service-stg.azurewebsites.net/assistentes/", id)
    //   .then((response) => {
    //     console.log(response.data);
    //     handleCloseConfirmation();
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     handleCloseConfirmation();
    //   });
    toast.success("Assistente editado com sucesso!");
  };

  const columnsTable = [
    { field: "nome", headerName: "Nome", width: 150 },
    { field: "cpf", headerName: "CPF", width: 150 },
    {
      field: "dCriacao",
      headerName: "Data de criação",
      width: 150,
      type: "date",
    },
    { field: "obs", headerName: "Observações", width: 150 },
    {
      field: "admin",
      headerName: "Administrador(a)",
      width: 180,
      type: "boolean",
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<BsFillTrashFill size={18} />}
          label="Deletar"
          onClick={() => {
            setId(params.id);
            handleOpenConfirmation();
          }}
        />,
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<AiFillEdit size={20} />}
          label="Editar"
          onClick={async () => {
            setId(params.id);
            setOpenEdit(true);
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
              defaultValue={assistente.nome}
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
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
              id="outlined-senha"
              label="Senha"
              type="password"
              required={true}
              {...register("senha")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-Observações"
              label="Observações"
              {...register("obs")}
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
                {...register("admin")}
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
              defaultValue={assistente.nome}
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
              required={true}
              inputProps={{ maxLength: 11 }}
              defaultValue={assistente.cpf}
              {...register("cpf")}
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
                defaultValue={assistente.admin}
                label="Administrador(a)?"
                {...register("admin")}
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
      {/* <button onClick={notify}>Notify!</button> */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}
