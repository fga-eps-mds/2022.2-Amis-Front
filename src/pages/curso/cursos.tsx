/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Modal,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import {
  BsFillTrashFill
} from "react-icons/bs";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  cadastrarCurso,
  editarCurso,
  excluirCurso,
  listarCurso,
} from "../../services/cursos";
import { queryClient } from "../../services/queryClient";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { CursosCadastrarDTO } from "./dtos/CursosCadastrar.dto";
import { CursosListarDTO } from "./dtos/CursosListar.dto";

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

export function Curso() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [curso, setCurso] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const registerCurso = async (data: any) => {
    const curso = {
      nome: data.nome,
      descricao: data.descricao,
      duracaoHoras: data.duracaoHoras,
    } as CursosCadastrarDTO;

    const response = await cadastrarCurso(curso);

    if (response.status === 201) {
      setOpen(false);
      queryClient.invalidateQueries("listar_curso");
      toast.success("Curso cadastrado com sucesso!");
    }
  };

  useQuery("listar_curso", async () => {
    const response = await listarCurso();

    const temp: CursosListarDTO[] = [];
    response.data.forEach((value: CursosListarDTO, index: number) => {
      //console.log(value.nome);
      temp.push({
        id: value.id,
        nome: value.nome,
        descricao: value.descricao,
        duracaoHoras: value.duracaoHoras,
      });
    });
    setDataTable(temp);
  });

  const deletarCurso = async () => {
    const response = await excluirCurso(id.toString());

    if (response.status === 204) {
      toast.success("Curso excluído com sucesso!");
    } else {
      toast.error("Erro ao excluir urso");
    }

      handleCloseConfirmation();
      await queryClient.invalidateQueries("listar_curso");
  };
  const carregarCurso = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });
    const curso = response as CursosListarDTO;
    setCurso(curso);
    setValue("idEdit", curso.id);
    setValue("nomeEdit", curso.nome);
    setValue("descricaoEdit", curso.descricao);
    setValue("duracaoEdit", curso.duracaoHoras);
    setOpenEdit(true);
  };

  const editCurso = async (data: any) => {

    const cursoEditado = {
      id: data.idEdit,
      nome: data.nomeEdit,
      descricao: data.descricaoEdit,
      duracaoHoras: data.duracaoEdit,
    };
    console.log(curso.id)

    const response = await editarCurso(cursoEditado.id.toString(), cursoEditado);
    if (response.status === 201) {
      try {
        await queryClient.invalidateQueries("listar_curso");
        setOpenEdit(false);
        toast.success("Curso editado com sucesso!");
      } catch (error) {
        // Handle the error
        //console.error(error);
      }
    }
  };

  const columnsTableCursos = [
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
            carregarCurso(params.id);
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
    { field: "id", headerName: "Código", flex: 2 },
    { field: "nome", headerName: "Nome do curso", flex: 2 },
    { field: "descricao", headerName: "Descrição", flex: 2 },
    { field: "duracaoHoras", headerName: "Duração (em horas)", flex: 2 },
  ];

  return (
    <Container>
      {" "}
      <Sidebar />
      <Content>
        <Navbarlog text={"Cursos"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          <PrimaryButton text={"Exportar"} handleClick={handleClose} />
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTableCursos} />
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
            <Button onClick={deletarCurso} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText>Preencha corretamente os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(registerCurso)}>
            <TextField
              id="outlined-nomCurso"
              label="Nome do Curso"
              required={true}
              inputProps={{ maxLength: 70 }}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-descricao"
              label="Descrição"
              required={true}
              inputProps={{ maxLength: 300 }}
              {...register("descricao")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-duracao"
              label="Duração (em horas)"
              {...register("duracaoHoras")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Confirmar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText>Altere os dados cadastrados</FormText>
          <Form onSubmit={handleSubmit(editCurso)}>
          <TextField
              id="outlined-codigo"
              label="Código"
              required={true}
              disabled={true}
              {...register("idEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-nomCurso"
              label="Nome do Curso"
              required={true}
              inputProps={{ maxLength: 70 }}
              {...register("nomeEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-descricao"
              label="Descrição"
              required={true}
              inputProps={{ maxLength: 300 }}
              {...register("descricaoEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-duracao"
              label="Duração (em horas)"
              {...register("duracaoEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}