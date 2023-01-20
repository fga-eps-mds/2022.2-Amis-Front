import React, { SyntheticEvent, useState } from "react";
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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { TurmasListarDTO } from "./dtos/TurmasListarDTO";
import { TurmasCadastrarDTO } from "./dtos/TurmasCadastrarDTO";
import { VagasListarDTO } from "./dtos/VagasListarDTO";
import { GridActionsCellItem, GridRowId, DataGrid } from "@mui/x-data-grid";
import {
  BsFillTrashFill,
  BsFillPersonPlusFill,
  BsFillPersonDashFill,
} from "react-icons/bs";
import { FaList } from "react-icons/fa";
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

export function Turmas(this: any) {
  const [open, setOpen] = useState(false);
  const [turma, setTurma] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMatricula, setOpenMatricula] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const [vagasData, setVagasData] = useState(Array<Object>);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  const registerTurmas = async (data: any) => {
    const turma = {
      descricao: data.descricao,
      turno: data.turno,
      capacidade: data.capacidade,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
    } as unknown as TurmasCadastrarDTO;

    // setDataTable([...dataTable, turma]);
    // setOpen(false);

    await axios
      .post("http://localhost:8080/turmas/", turma)
      .then((response) => {
        console.log(response.status);
        handleClose();
      })
      .catch((err) => console.warn(err));
  };

  useQuery("listar_Turmas", async () => {
    const response = await axios.get("http://localhost:8080/turmas/");
    const temp: TurmasListarDTO[] = [];
    response.data.forEach((value: TurmasListarDTO) => {
      temp.push({
        id: value.id,
        descricao: value.descricao,
        turno: value.turno,
        capacidade: value.capacidade,
        horarioInicio: value.horarioInicio,
        horarioFim: value.horarioFim,
        dataInicio: value.dataInicio,
        dataFim: value.dataFim,
      });
    });
    setDataTable(temp);
  });

  const deleteTurmas = async () => {
    await axios
      .delete("http://localhost:8080/turmas/" + id)
      .then((response) => {
        console.log(response.status);
        handleCloseConfirmation();
      })
      .catch((err) => {
        console.warn(err);
        handleCloseConfirmation();
      });
  };

  const editTurmas = async (data: any) => {
    const turmaEdit = {
      descricao: data.descricao,
      turno: data.turno,
      capacidade: data.capacidade,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
    } as unknown as TurmasCadastrarDTO;

    await axios
      .put("http://localhost:8080/turmas/" + id, turmaEdit)
      .then((response) => {
        console.log(response.status);
        setOpenEdit(false);
      })
      .catch((err) => {
        console.warn(err);
        setOpenEdit(false);
      });

    //   dataTable.find((element: any) => {
    //   if (element.id === id) {
    //     const turmaEdit = {
    //       descricao: data.descricao,
    //       turno: data.turno,
    //       capacidade: data.capacidade,
    //       horarioInicio: data.horarioInicio,
    //       horarioFim: data.horarioFim,
    //       dataInicio: data.dataInicio,
    //       dataFim: data.dataFim,
    //     } as unknown as TurmasCadastrarDTO;
    //     // element = turmaEdit;
    //     // console.log("element", element);
    //     // setTurma(turmaEdit);
    //   }
    // });
  };

  const matriculaAluna = async (idTurma: number, idAluna: number) => {
    await axios
      .delete("http://localhost:8080/matricula/" + idTurma + "/" + idAluna)
      .then((response) => {
        console.log(response.data);
        handleCloseConfirmation();
      })
      .catch((err) => {
        console.warn(err);
        handleCloseConfirmation();
      });
  };

  const removeAluna = async () => {
    await axios
      .delete("http://localhost:8080/matricula/" /* + idTurma */ + "/" + id)
      .then((response) => {
        console.log(response.data);
        handleCloseConfirmation();
      })
      .catch((err) => {
        console.warn(err);
        handleCloseConfirmation();
      });
  };

  const columnsTableAlunas = [
    { field: "nome", headerName: "Nome", width: 350 },
    { field: "cpf", headerName: "CPF", width: 150 },
    { field: "dNascimento", headerName: "Data de Nascimento", width: 150 },
    {
      field: "actions",
      headerName: "Remover",
      type: "actions",
      width: 100,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<BsFillPersonDashFill size={18} />}
          label="Remover aluna da turma"
          onClick={() => {
            setId(params.id);
          }}
        />,
      ],
    },
  ];

  const columnsTableAlunasMatricular = [
    { field: "nome", headerName: "Nome", width: 420 },
    { field: "cpf", headerName: "CPF", width: 150 },
    { field: "dNascimento", headerName: "Data de Nascimento", width: 150 },
  ];

  // PARA SIMULAR ALUNOS
  const rowsAlunas = [
    {
      id: 1,
      nome: "Maria das Dores",
      cpf: "87436298413",
      dNascimento: "26/12/1957",
    },
    {
      id: 2,
      nome: "Renata dos Santos",
      cpf: "56482862441",
      dNascimento: "01/08/1990",
    },
  ];

  useQuery("listar_Vagas", async () => {
    const responseVagas = await axios.get("http://localhost:8080/turmas/");
    const tempVagas: VagasListarDTO[] = [];
    responseVagas.data.forEach((value: VagasListarDTO) => {
      tempVagas.push({
        capacidade: value.capacidade,
      });
    });
    setVagasData(tempVagas);
  });

  const rowVagas = [{ vagasTot: 30, vagasOcup: 20 }];

  const columnsTable = [
    { field: "descricao", headerName: "Turma", width: 250 },
    { field: "turno", headerName: "Turno", width: 125 },
    { field: "capacidade", headerName: "Número de vagas", width: 180 },
    { field: "horarioInicio", headerName: "Horário de Início", width: 180 },
    { field: "horarioFim", headerName: "Horário de Término", width: 180 },
    { field: "dataInicio", headerName: "Data de Início", width: 165 },
    { field: "dataFim", headerName: "Data de Término", width: 165 },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      width: 150,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<BsFillPersonPlusFill size={20} />}
          label="MatricularAlunas"
          onClick={() => {
            setId(params.id);
            setOpenMatricula(true);
          }}
        />,
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<FaList size={20} />}
          label="ListarAlunas"
          onClick={() => {
            setId(params.id);
            setOpenList(true);
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
            {"Você tem certeza que deseja excluir esta turma?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteTurmas} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openRemove}
          onClose={setOpenRemove}
          aria-labelledby="removeAlert-dialog-title"
          aria-describedby="removeAlert-dialog-description"
        >
          <DialogTitle id="removeAlert-dialog-title">
            {"Você tem certeza que deseja desmatricular a aluna?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={removeAluna} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
          >
            Cadastrar uma nova turma
          </FormText>
          <Form onSubmit={handleSubmit(registerTurmas)}>
            <TextField
              id="outlined-descricao"
              label="Turma"
              defaultValue={turma.descricao}
              required={true}
              {...register("descricao")}
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
              id="outlined-capacidade"
              label="Número de vagas"
              required={true}
              {...register("capacidade")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-horarioInicio"
              label="Horário de Inicio"
              required={true}
              {...register("horarioInicio")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-horarioFim"
              label="Horário de Término"
              required={true}
              {...register("horarioFim")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dataInicio"
              label="Data de Início"
              required={true}
              {...register("dataInicio")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dataFim"
              label="Data de Término"
              required={true}
              {...register("dataFim")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Cadastrar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormText
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
          >
            Editar dados cadastrais da turma
          </FormText>
          <Form onSubmit={handleSubmit(editTurmas)}>
            <TextField
              id="outlined-descricao"
              label="Turma"
              defaultValue={turma.descricao}
              required={true}
              {...register("descricao")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-capacidade"
              label="Número de vagas"
              defaultValue={turma.capacidade}
              required={true}
              {...register("capacidade")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-turno"
              label="Turno"
              defaultValue={turma.label}
              required={true}
              {...register("turno")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dataInicio"
              label="Data de Início"
              defaultValue={turma.dataInicio}
              required={true}
              {...register("dataInicio")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dataFim"
              label="Data de Término"
              defaultValue={turma.dataFim}
              required={true}
              {...register("dataFim")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-horarioInicio"
              label="Horário de Inicio"
              defaultValue={turma.horarioInicio}
              required={true}
              {...register("horarioInicio")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-horarioFim"
              label="Horário de Término"
              defaultValue={turma.horarioFim}
              required={true}
              {...register("horarioFim")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openList} onClose={() => setOpenList(false)}>
        <Box sx={style} style={{ width: 900 }}>
          <FormText
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
          >
            Alunas matriculadas na turma
          </FormText>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginBottom: 50,
            }}
          >
            <TableContainer
              component={Paper}
              style={{ width: 280, justifyContent: "center" }}
            >
              <Table
                sx={{ minWidth: 50, width: 280, whiteSpace: "nowrap" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Vagas Totais</TableCell>
                    <TableCell align="right">Vagas Preenchidas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowVagas.map((row) => (
                    // eslint-disable-next-line react/jsx-key
                    <TableRow>
                      <TableCell align="left" style={{ textAlign: "center" }}>
                        {row.vagasTot}
                      </TableCell>
                      <TableCell align="right" style={{ textAlign: "center" }}>
                        {row.vagasOcup}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <DataGrid
            rows={rowsAlunas}
            columns={columnsTableAlunas}
            pageSize={10}
            rowsPerPageOptions={[5]}
          />
          <div
            style={{ justifyContent: "center", display: "flex", marginTop: 20 }}
          >
            <PrimaryButton
              text={"Fechar"}
              handleClick={() => setOpenList(false)}
            />
          </div>
        </Box>
      </Modal>
      <Modal open={openMatricula} onClose={() => setOpenMatricula(false)}>
        <Box sx={style} style={{ width: 900 }}>
          <FormText
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
          >
            Matricular alunas na turma
          </FormText>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginBottom: 50,
            }}
          >
            <TableContainer
              component={Paper}
              style={{ width: 280, justifyContent: "center" }}
            >
              <Table
                sx={{ minWidth: 50, width: 280, whiteSpace: "nowrap" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Vagas Totais</TableCell>
                    <TableCell align="right">Vagas Preenchidas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowVagas.map((row) => (
                    // eslint-disable-next-line react/jsx-key
                    <TableRow>
                      <TableCell align="left" style={{ textAlign: "center" }}>
                        {row.vagasTot}
                      </TableCell>
                      <TableCell align="right" style={{ textAlign: "center" }}>
                        {row.vagasOcup}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <DataGrid
            rows={rowsAlunas}
            columns={columnsTableAlunasMatricular}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            checkboxSelection={true}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = rowsAlunas.filter((row) =>
                selectedIDs.has(row.id)
              );
              // selectedRowData contém os dados de cada aluna selecionada no checkbox
              console.log(selectedRowData);
            }}
          />

          <div
            style={{ justifyContent: "center", display: "flex", marginTop: 20 }}
          >
            <PrimaryButton
              text={"Matricular"}
              handleClick={() => setOpenMatricula(false)}
            />
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
