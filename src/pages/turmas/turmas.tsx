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
import { TurmasListarDTO } from "./dtos/TurmasListarDTO";
import { TurmasCadastrarDTO } from "./dtos/TurmasCadastrarDTO";
import dayjs from "dayjs";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

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

export function Turmas() {
  // mudar
  const [open, setOpen] = useState(false);
  const [turma, setTurma] = useState(Object);
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

  const registerTurmas = async (data: any) => {
    // mudar
    const turma = {
      id: Math.random(),
      descricao: data.descricao,
      numeroVagas: data.numeroVagas,
      vagasPrenchidas: data.vagasPrenchidas,
      horario: data.horario,
      turno: data.turno,
      admin: data.admin,
      dCriacao: dayjs().format("DD/MM/YYYY"),
    } as unknown as TurmasCadastrarDTO;

    setDataTable([...dataTable, turma]); // mudar
    setOpen(false);

    // await axios
    //   .post(
    //     "https://amis-service-stg.azurewebsites.net/turmas/",
    //     turmas
    //   )
    //   .then((response) => {
    //     console.log(response.status);
    //     handleClose();
    //   })
    //   .catch((err) => console.warn(err));
  };

  // useQuery("listar_Turmas", async () => {
  //   const response = await axios.get(
  //     "https://amis-service-stg.azurewebsites.net/turmas/"
  //   );
  //   const temp: TurmasListarDTO[] = [];
  //   response.data.forEach((value: TurmasListarDTO) => {
  //     temp.push({
  //       id: Math.random(),
  //        descricao: value.descricao,
  //        numeroVagas: value.numeroVagas,
  //        vagasPrenchidas: value.vagasPrenchidas,
  //        horario: value.horario,
  //        turno: value.turno,
  //        admin: value.admin,
  //     });
  //   });
  //   setDataTable(temp);
  // });

  const deleteTurmas = async () => {
    console.log("Id excluido", id);
    setOpenConfirmation(false);
    // await axios
    //   .delete("https://amis-service-stg.azurewebsites.net/turmas/", id)
    //   .then((response) => {
    //     console.log(response.data);
    //     handleCloseConfirmation();
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     handleCloseConfirmation();
    //   });
  };

  const editTurmas = async (data: any) => {
    // mudar
    // eslint-disable-next-line array-callback-return

    dataTable.find((element: any) => {
      if (element.id === id) {
        const turma = {
          descricao: data.descricao,
          numeroVagas: data.numeroVagas,
          vagasPrenchidas: data.vagasPrenchidas,
          turno: data.turno,
          horario: data.horario,
        };
        element = turma;
        console.log("element", element);
        setTurma(turma);
        setOpenEdit(false);
      }
    });
    
    // await axios
    //   .delete("https://amis-service-stg.azurewebsites.net/Turmas/", id)
    //   .then((response) => {
    //     console.log(response.data);
    //     handleCloseConfirmation();
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     handleCloseConfirmation();
    //   });
  };

  const columnsTable = [
    // mudar
    { field: "descricao", headerName: "Descrição", width: 250 },
    { field: "numeroVagas", headerName: "Número de vagas", width: 150 },
    { field: "vagasPrenchidas", headerName: "Vagas preenchidas", width: 150 },
    {
      field: "dCriacao",
      headerName: "Data de início",
      width: 120,
      type: "date",
    },
    { field: "horario", headerName: "Horário", width: 100 },
    { field: "turno", headerName: "Turno", width: 100 },
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
      {" "}
      <Sidebar />
      <Content>
        <Navbarlog text={"Turmas"} />
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
            <Button onClick={deleteTurmas} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText>Preencha corretamente os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(registerTurmas)}>
            <TextField
              id="outlined-descricao"
              label="Descrição"
              defaultValue={turma.descricao}
              required={true}
              {...register("descricao")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-numeroVagas"
              label="Número de vagas"
              required={true}
              {...register("numeroVagas")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-vagasPrenchidas"
              label="Vagas preenchidas"
              required={true}
              {...register("vagasPrenchidas")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-turno"
              label="Turno"
              required={true}
              {...register("turno")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-horario"
              label="Horario"
              required={true}
              {...register("horario")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Cadastrar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText>Altere os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(editTurmas)}>
            <TextField
              id="outlined-descricao"
              label="Descrição"
              required={true}
              inputProps={{ maxLength: 12 }}
              defaultValue={turma.descricao}
              {...register("descricao")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-numeroVagas"
              label="Número de vagas"
              required={true}
              defaultValue={turma.numeroVagas}
              {...register("numeroVagas")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-vagasPrenchidas"
              label="Vagas preenchidas"
              required={true}
              defaultValue={turma.vagasPrenchidas}
              {...register("vagasPrenchidas")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-turno"
              label="Turno"
              required={true}
              defaultValue={turma.turno}
              {...register("turno")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-horario"
              label="Horario"
              required={true}
              defaultValue={turma.horario}
              {...register("horario")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
