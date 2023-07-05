import { useState } from "react";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import DataTable, {
  TableProps,
} from "../../shared/components/TablePagination/tablePagination";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { FormProvider, useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
} from "../../shared/components/Style/style";
import { SupervisorDTO } from "./dtos/SupervisorDTO";
import ValueMask from "../../shared/components/Masks/ValueMask";
import {
  cadastrarSupervisor,
  editarSupervisor,
  excluirSupervisor,
  listarSupervisor,
} from "../../services/supervisor";
import { AxiosError } from "axios";
import { queryClient } from "../../services/queryClient";

const Container = getContainerStyles();
const Content = getContentStyles();
const DivButtons = getDivButtonsStyles();
const Form = getFormStyles();
const FormText = getFormTextStyles();
const style = getInlineStyles();

interface AxiosBadRequestError extends AxiosError {
  response: AxiosError["response"] & {
    data: {
      detail: {
        [key: string]: {
          detail: string;
          status: boolean;
        };
      };
    };
  };
}

export function Supervisor() {
  const methods = useForm<SupervisorDTO>();
  const { register, handleSubmit } = methods;

  const methodsForEdit = useForm<SupervisorDTO>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
  } = methodsForEdit;

  const [dataTable, setDataTable] = useState<SupervisorDTO[]>([]);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [supervisorLoginToDelete, setSupervisorLoginToDelete] = useState("");

  function handleOpenRegister() {
    setIsRegisterModalOpen(true);
  }

  function handleCloseRegisterModal() {
    setIsRegisterModalOpen(false);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
  }

  // function handleExport() {
  //   //
  // }

  useQuery("listar_supervisor", async () => {
    const supervisor = await listarSupervisor();
    if (supervisor instanceof AxiosError) {
      return;
    }

    setDataTable(supervisor.data);
  });

  function prepararEdicao(login: GridRowId) {
    const supervisor = dataTable.find(
      (supervisor) => supervisor.login === login
    );
    if (!supervisor) {
      return;
    }

    setValue("cpf", supervisor.cpf);
    setValue("data_nascimento", supervisor.data_nascimento);
    setValue("email", supervisor.email);
    setValue("login", supervisor.login);
    setValue("nome", supervisor.nome);
    setValue("telefone", supervisor.telefone);
    setValue("senha", supervisor.senha);
    setIsEditModalOpen(true);
  }

  async function editSupervisor(payload: SupervisorDTO) {
    payload.cpf = payload.cpf.replace(/\D/g, "");
    payload.telefone = payload.telefone.replace(/\D/g, "");
    payload.data_nascimento = payload.data_nascimento
      .split("/")
      .reverse()
      .join("-");

    await editarSupervisor(payload.login, payload);
    await queryClient.invalidateQueries("listar_supervisor");
    setIsEditModalOpen(false);
  }

  async function prepararDelecao(login: GridRowId) {
    setSupervisorLoginToDelete(login as string);
    setIsDeleteModalOpen(true);
  }

  async function deletarSupervisor() {
    await excluirSupervisor(supervisorLoginToDelete);
    await queryClient.invalidateQueries("listar_supervisor");
    setIsDeleteModalOpen(false);
  }

  async function registerSupervisor(payload: SupervisorDTO) {
    if (payload.senha !== payload.senhaConfirmada) {
      toast.error("As senhas não coincidem", {
        position: "bottom-right",
      });
      return;
    }

    if (!payload.cpf) {
      toast.error("CPF inválido", {
        position: "bottom-right",
      });
      return;
    }

    if (!payload.data_nascimento) {
      toast.error("Data de nascimento inválida", {
        position: "bottom-right",
      });
      return;
    }

    if (!payload.telefone) {
      toast.error("Telefone inválido", {
        position: "bottom-right",
      });
      return;
    }

    payload.cpf = payload.cpf.replace(/\D/g, "");
    payload.telefone = payload.telefone.replace(/\D/g, "");
    payload.data_nascimento = payload.data_nascimento
      .split("/")
      .reverse()
      .join("-");

    const possibleErr = await cadastrarSupervisor(payload);
    if (possibleErr instanceof AxiosError) {
      if (possibleErr.status === 400) {
        const error = possibleErr as AxiosBadRequestError;
        const errors = error.response?.data.detail;
        Object.values(errors).forEach((value) => {
          if (!value.status) {
            toast.error(value.detail, {
              position: "bottom-right",
            });
          }
        });
      } else {
        toast.error("Aconteceu um erro inesperado no servidor", {
          position: "bottom-right",
        });
      }

      return;
    }

    toast.success("Supervisor Cadastrado Com Sucesso");
    await queryClient.invalidateQueries("listar_supervisor");
    setIsRegisterModalOpen(false);
  }

  const columnsTable: TableProps["columns"] = [
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      getActions: (params: { id: GridRowId }) => [
        <IconButton
          key={1}
          id="meu-grid-actions-cell-item"
          data-testid="teste-editar"
          onClick={async () => {
            prepararEdicao(params.id);
          }}
        >
          <AiFillEdit size={20} />
          <Typography variant="body2"></Typography>
        </IconButton>,

        <IconButton
          key={2}
          data-testid="teste-excluir"
          onClick={async () => {
            await prepararDelecao(params.id);
          }}
        >
          <BsFillTrashFill size={18} />
          <Typography variant="body2"></Typography>
        </IconButton>,
      ],
    },
    { field: "login", headerName: "Login", flex: 2 },
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 2 },
    { field: "data_nascimento", headerName: "Data Nascimento", flex: 2 },
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Supervisor"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpenRegister} />
        </DivButtons>
        <DataTable
          getRowId={(row) => row.login}
          data={dataTable}
          columns={columnsTable}
        />

        {/* Excluir Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Você tem certeza que deseja excluir?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setIsDeleteModalOpen(false)}>Não</Button>
            <Button onClick={deletarSupervisor} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>

      {/* Register Modal */}
      <Modal open={isRegisterModalOpen} onClose={handleCloseRegisterModal}>
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText>Preencha corretamente os dados cadastrais.</FormText>
            <Form onSubmit={handleSubmit(registerSupervisor)}>
              <TextField
                id="outlined-nome"
                label="Nome Completo"
                required={true}
                inputProps={{ maxLength: 300 }}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-email"
                label="Email"
                type="email"
                required={true}
                inputProps={{ maxLength: 70 }}
                {...register("email")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <ValueMask label="cpf" />
              <TextField
                id="outlined-login"
                label="Login"
                required={true}
                inputProps={{ maxLength: 70 }}
                {...register("login")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-password"
                label="Senha"
                required={true}
                type="password"
                inputProps={{ maxLength: 70 }}
                {...register("senha")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-confirmed-password"
                label="Confirmar Senha"
                type="password"
                required={true}
                inputProps={{ maxLength: 70 }}
                {...register("senhaConfirmada")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <ValueMask label="data_nascimento" />
              <ValueMask label="telefone" />
              <PrimaryButton data-testid="teste-cadastrar" text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
        <Box sx={style}>
          <FormProvider {...methodsForEdit}>
            <FormText>Preencha corretamente os dados cadastrais.</FormText>
            <Form onSubmit={handleSubmitEdit(editSupervisor)}>
              <TextField
                id="outlined-nome"
                label="Nome Completo"
                required={true}
                inputProps={{ maxLength: 300 }}
                {...registerEdit("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-email"
                label="Email"
                type="email"
                required={true}
                inputProps={{ maxLength: 70 }}
                {...registerEdit("email")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <ValueMask label="cpf" />
              <TextField
                id="outlined-login"
                label="Login"
                required={true}
                inputProps={{ maxLength: 70 }}
                {...registerEdit("login")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <ValueMask label="data_nascimento" />
              <ValueMask label="telefone" />
              <PrimaryButton text={"Editar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
    </Container>
  );
}
