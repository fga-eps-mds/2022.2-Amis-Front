/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
  responsiveFontSizes,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  toggleButtonGroupClasses,
} from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { TurmasListarDTO } from "./dtos/TurmasListar.dto";
import { TurmasCadastrarDTO } from "./dtos/TurmasCadastrar.dto";
import { VagasListarDTO } from "./dtos/VagasListar.dto";
import { GridActionsCellItem, GridRowId, DataGrid } from "@mui/x-data-grid";
import {
  BsFillTrashFill,
  BsFillPersonPlusFill,
  BsFillPersonDashFill,
} from "react-icons/bs";
import { FaList } from "react-icons/fa";
// import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
// import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { TurmasMatricularDTO } from "./dtos/TurmasMatricular.dto";
import { toast } from "react-toastify";
import { queryClient } from "../../services/queryClient";
import { AlunasListarDTO } from "../alunas/dtos/AlunasListar.dto";

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
  const [idTurma, setIdTurma] = useState<GridRowId>(0);
  const [idAluna, setIdAluna] = useState<GridRowId>(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMatricula, setOpenMatricula] = useState(false);
  const [openList, setOpenList] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const [openDesmat, setOpenDesmat] = useState(false);
  const handleDesmatOpenConfirmation = () => setOpenDesmat(true);
  const handleDesmatCloseConfirmation = () => setOpenDesmat(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const [dataTableAlunas, setDataTableAlunas] = useState(Array<Object>);
  const [vagas, setVagas] = useState<VagasListarDTO>();
  const [matriculas, setMatriculas] = useState(Array);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});
  const [alunasTurma, setAlunasTurma] = useState(Array<Object>);

  const registerTurmas = async (data: any) => {
    const turma = {
      descricao: data.descricao,
      turno: data.turno,
      capacidade: data.capacidade,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
    } as TurmasCadastrarDTO;

    await axios
      .post("https://service-amis.azurewebsites.net/turmas/", turma)
      .then((response) => {
        console.log(response.status);
        toast.success("Turma criada com sucesso!");
        handleClose();
      })
      .catch((err) => console.warn(err));
  };

  useQuery("listar_Turmas", async () => {
    const response = await axios.get(
      "https://service-amis.azurewebsites.net/turmas/"
    );
    const temp: TurmasListarDTO[] = [];
    response.data.forEach((value: TurmasListarDTO) => {
      if (value.turno === "1") {
        temp.push({
          id: value.id,
          descricao: value.descricao,
          capacidade: value.capacidade,
          horarioInicio: value.horarioInicio,
          horarioFim: value.horarioFim,
          dataInicio: value.dataInicio,
          dataFim: value.dataFim,
          turno: "Matutino",
        });
      }
      if (value.turno === "2") {
        temp.push({
          id: value.id,
          descricao: value.descricao,
          capacidade: value.capacidade,
          horarioInicio: value.horarioInicio,
          horarioFim: value.horarioFim,
          dataInicio: value.dataInicio,
          dataFim: value.dataFim,
          turno: "Vespertino",
        });
      }
      if (value.turno === "3") {
        temp.push({
          id: value.id,
          descricao: value.descricao,
          capacidade: value.capacidade,
          horarioInicio: value.horarioInicio,
          horarioFim: value.horarioFim,
          dataInicio: value.dataInicio,
          dataFim: value.dataFim,
          turno: "Noturno",
        });
      }
      // temp.push({
      //   id: value.id,
      //   descricao: value.descricao,
      //   turno: value.turno,
      //   capacidade: value.capacidade,
      //   horarioInicio: value.horarioInicio,
      //   horarioFim: value.horarioFim,
      //   dataInicio: value.dataInicio,
      //   dataFim: value.dataFim,
      // });
    });
    setDataTable(temp);
  });

  const deleteTurmas = async () => {
    await axios
      .delete("https://service-amis.azurewebsites.net/turmas/" + id)
      .then((response) => {
        console.log(response.status);
        toast.success("Turma excluida com sucesso!");
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
    } as TurmasCadastrarDTO;

    await axios
      .put("https://service-amis.azurewebsites.net/turmas/" + id, turmaEdit)
      .then((response) => {
        console.log(response.status);
        toast.success("Turma atualizada com sucesso!");
        setOpenEdit(false);
      })
      .catch((err) => {
        console.warn(err);
        setOpenEdit(false);
      });
  };

  const matriculaAluna = async (idDaTurma: number, idDaAluna: String) => {
    const turmaMatricula = {
      idTurma: idDaTurma,
      idAluna: String(idDaAluna),
    } as unknown as TurmasMatricularDTO;

    if (matriculas.length > vagas?.vagasDisponiveis!) {
      toast.error("Quantidade de vagas excedida");
    } else {
      await axios
        .post(
          "https://service-amis.azurewebsites.net/matricula/",
          turmaMatricula
        )
        .then((response) => {
          console.log(response.data);
          console.log(
            "Aluna(s) de ID: " +
              turmaMatricula.idAluna +
              " matriculada(s) na turma de ID: " +
              idTurma
          );
          toast.success("Alunas matriculadas com sucesso!");
          queryClient.invalidateQueries("listar_alunas");
          setOpenMatricula(false);
        })
        .catch((err) => {
          console.warn(err);
          alert("Erro ao matricular aluna(s)");
          setOpenMatricula(false);
        });
    }
  };

  const desmatAluna = async (idTurma: number, idAluna: number) => {
    await axios
      .delete(
        "https://service-amis.azurewebsites.net/matricula/" +
          idTurma +
          "/" +
          idAluna
      )
      .then((response) => {
        console.log(response.data);
        console.log(
          "Aluna de ID: " +
            idAluna +
            " desmatriculada da turma de ID: " +
            idTurma
        );
        toast.success("Aluna(s) removida(s) da turma com sucesso!");
        queryClient.invalidateQueries("listar_alunas");
        handleDesmatCloseConfirmation();
      })
      .catch((err) => {
        console.warn(err);
        alert("Erro ao desmatricular aluna");
        handleDesmatCloseConfirmation();
      });
  };

  const columnsTableAlunas = [
    { field: "nome", headerName: "Nome", width: 330 },
    { field: "cpf", headerName: "CPF", width: 150 },
    { field: "dNascimento", headerName: "Data de Nascimento", width: 150 },
    {
      field: "actions",
      headerName: "Desmatricular",
      type: "actions",
      width: 120,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<BsFillPersonDashFill size={18} />}
          label="Desmatricular aluna da turma"
          onClick={async () => {
            await listarIDAluna(Number(params.id));
            setId(params.id);
            handleDesmatOpenConfirmation();
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

  const consultaAlunasNaTurma = async (idTurma: number) => {
    await axios
      .get("https://service-amis.azurewebsites.net/matricula/" + idTurma)
      .then((response) => {
        setAlunasTurma(response.data);
      })
      .catch((err) => {
        setAlunasTurma([]);
        console.warn(err);
      });
  };

  useQuery("listar_alunas", async () => {
    const response = await axios.get(
      "https://service-amis.azurewebsites.net/alunas/"
    );

    const temp: AlunasListarDTO[] = [];
    response.data.forEach((value: AlunasListarDTO) => {
      temp.push({
        id: value.id,
        nome: value.nome,
        cpf: value.cpf,
        dNascimento: value.dNascimento,
      });
    });
    setDataTableAlunas(temp);
  });

  const listarIDTurma = async (idDaTurma: number) => {
    console.log("ID Turma:", idDaTurma);

    setIdTurma(idDaTurma);
  };

  const listarIDAluna = async (idDaAluna: number) => {
    setIdAluna(idDaAluna);
  };

  const listarVagas = async (idTurmaVagas: number) => {
    const response = await axios.get(
      "https://service-amis.azurewebsites.net/matricula/turma/" + idTurmaVagas
    );
    setVagas(response.data as VagasListarDTO);
  };

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
          onClick={async () => {
            await listarIDTurma(Number(params.id));
            const idTurma = params.id;
            await listarVagas(Number(idTurma));

            setOpenMatricula(true);
          }}
        />,
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<FaList size={20} />}
          label="ListarAlunas"
          onClick={async () => {
            await consultaAlunasNaTurma(Number(params.id));
            await listarIDTurma(Number(params.id));
            setId(params.id);
            const idTurma = params.id;
            await listarVagas(Number(idTurma));
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
          open={openDesmat}
          onClose={setOpenDesmat}
          aria-labelledby="removeAlert-dialog-title"
          aria-describedby="removeAlert-dialog-description"
        >
          <DialogTitle id="removeAlert-dialog-title">
            {"Você tem certeza que deseja desmatricular a aluna?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDesmatCloseConfirmation}>Não</Button>
            <Button
              onClick={async () => {
                await desmatAluna(Number(idTurma), Number(idAluna));
              }}
              autoFocus
            >
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Turno</InputLabel>
              <Select
                id="simple-select-label-turno"
                labelId="simple-select-turno"
                label="Informe o turno"
                {...register("turno")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              >
                <MenuItem value={1 as any}>Matutino</MenuItem>
                <MenuItem value={2 as any}>Vespertino</MenuItem>
                <MenuItem value={3 as any}>Noturno</MenuItem>
              </Select>
            </FormControl>
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Turno</InputLabel>
              <Select
                id="simple-select-label-turno"
                labelId="simple-select-turno"
                label="Informe o turno"
                {...register("turno")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              >
                <MenuItem value={1 as any}>Matutino</MenuItem>
                <MenuItem value={2 as any}>Vespertino</MenuItem>
                <MenuItem value={3 as any}>Noturno</MenuItem>
              </Select>
            </FormControl>
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
                    <TableCell align="right">Vagas Disponíveis</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={{ textAlign: "center" }}>
                      {vagas?.vagasTotais}
                    </TableCell>
                    <TableCell align="right" style={{ textAlign: "center" }}>
                      {vagas?.vagasDisponiveis}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* TABELA DE ALUNAS NA TURMA */}
          <DataGrid
            rows={alunasTurma}
            columns={columnsTableAlunas}
            pageSize={10}
            rowsPerPageOptions={[10]}
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
        <Box sx={style} style={{ width: 920 }}>
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
                    <TableCell align="right">Vagas Disponíveis</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={{ textAlign: "center" }}>
                      {vagas?.vagasTotais}
                    </TableCell>
                    <TableCell align="right" style={{ textAlign: "center" }}>
                      {vagas?.vagasDisponiveis}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <DataGrid
            rows={dataTableAlunas}
            columns={columnsTableAlunasMatricular}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableSelectionOnClick={true}
            checkboxSelection={true}
            onSelectionModelChange={(dataTableAlunas) => {
              const selectedIDs = new Set(dataTableAlunas);
              const selectedRowData = dataTableAlunas.filter(
                async () => await listarIDAluna(Number(selectedIDs.has(id)))
              );
              setMatriculas(
                selectedRowData.map(function (idTal) {
                  return idTal.toString();
                })
              );
              console.log(matriculas);
            }}
          />

          <div
            style={{ justifyContent: "center", display: "flex", marginTop: 20 }}
          >
            {vagas?.vagasDisponiveis! >= 1 && (
              <PrimaryButton
                text={"Matricular"}
                handleClick={async () =>
                  await matriculaAluna(Number(idTurma), String(matriculas))
                }
              />
            )}
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
