/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { SyntheticEvent, useContext, useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  IconButton,
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
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { FormProvider, useForm } from "react-hook-form";
import { TurmasListarDTO } from "./dtos/TurmasListar.dto";
import { TurmasDTO } from "./dtos/Turmas.dto";
import { TurmasCadastrarDTO } from "./dtos/TurmasCadastrar.dto";
import { VagasListarDTO } from "./dtos/VagasListar.dto";
import { GridActionsCellItem, GridRowId, DataGrid } from "@mui/x-data-grid";
import {
  BsFillTrashFill,
  BsFillPersonPlusFill,
  BsFillPersonDashFill,
} from "react-icons/bs";
import { TurmasMatricularDTO } from "./dtos/TurmasMatricular.dto";
import { toast } from "react-toastify";
import ValueMask from "../../shared/components/Masks/ValueMask";
import { queryClient } from "../../services/queryClient";
import { AlunasListarDTO } from "../alunas/dtos/AlunasListar.dto";
import {
  cadastrarTurmas,
  listarTurmas,
  apagarTurmas,
  editarTurmas,
  cadastrarAluna,
  desmatricularAluna,
  listarAlunasNaTurma,
  listarAlunas,
  listarVagasTurma,
  confereTurmaMatricula,
} from "../../services/turmas";
import { parse, compareAsc } from 'date-fns';
import { AiFillEdit } from "react-icons/ai";
import { excluirAssistente } from "../../services/assistentes";
import { AuthContext } from "../../context/AuthProvider";


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

function compareDates(date1: string, date2: string): number {
  const parsedDate1 = parse(date1, 'dd/MM/yy', new Date());
  const parsedDate2 = parse(date2, 'dd/MM/yy', new Date());

  return compareAsc(parsedDate1, parsedDate2);
}

function validateHorarios(inicio_aula: string, fim_aula: string): boolean {
  const [inicioHora, inicioMinuto] = inicio_aula.split(":").map(Number);
  const [fimHora, fimMinuto] = fim_aula.split(":").map(Number);

  if (
    inicioHora >= 0 &&
    inicioHora <= 23 &&
    inicioMinuto >= 0 &&
    inicioMinuto <= 59 &&
    fimHora >= 0 &&
    fimHora <= 23 &&
    fimMinuto >= 0 &&
    fimMinuto <= 59 &&
    (inicioHora < fimHora ||
      (inicioHora === fimHora && inicioMinuto < fimMinuto))
  ) {
    return true; // inicio_aula é anterior a fim_aula e dentro do intervalo válido
  }

  return false; // inicio_aula não é anterior a fim_aula ou fora do intervalo válido
}

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
  const [codigo, setCodigo] = useState<GridRowId>(0);
  const [selectedTurma, setSelectedTurma] = useState<GridRowId>(0);
  
  const methods = useForm({});
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const [alunasTurma, setAlunasTurma] = useState(Array<Object>);
  const { role } = useContext(AuthContext);

  const selectedCursos = watch("fk_curso", ""); // Make sure "fk_curso" matches the correct input name
  const selectedProfessor = watch("fk_professor", "");

  function transformDate(date: any) {
    const parts = date.split("/");
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return transformedDate;
  }

  const registerTurmas = async (data: any) => {
    const turma = {
      codigo: data.codigo,
      fk_curso: data.fk_curso,
      fk_professor: data.fk_professor,
      nome_turma: data.nome_turma,
      capacidade_turma: data.capacidade_turma,
      inicio_aula: data.inicio_aula,
      fim_aula: data.fim_aula,
      data_inicio: data.data_inicio,
      data_fim: data.data_fim,
      descricao: data.descricao,
    } as TurmasCadastrarDTO;

    // if (turma.nome_turma.length > 70) {
    //   toast.error("Nome da turma inválido, use menos de 70 caracteres.");
    //   return;
    // }    


    if (!validateHorarios(turma.inicio_aula, turma.fim_aula)) {
      // Datas inválidas, tratar o erro ou fornecer feedback ao usuário
      toast.error(
        "O horário de início deve ser anterior ao horário de término e deve estar entre 00:00h e 23:59h"
      );
      return;
    }

    if (turma.capacidade_turma <= 0) {
      toast.error("A capacidade_turma deve ser um número maior que 0.");
      return;
    }

    turma.data_inicio = transformDate(turma.data_inicio);
    turma.data_fim = transformDate(turma.data_fim);

    console.log(turma)

    const response = await cadastrarTurmas(turma);
    if (response.status === 201) {
      setOpen(false);
      toast.success("Turma criada com sucesso!");
    } else {
      toast.error("Erro ao criar a turma.");
    }
  };


  // faz uma requisição assincrona a função listar turmas
  useQuery("listar_turmas", async () => {
    const response = await listarTurmas();
    const temp: TurmasListarDTO[] = [];
    if (response.data && Array.isArray(response.data)) {
        response.data.forEach((value: TurmasListarDTO, index: number) => {
        const [y, m, d] = value.data_inicio.split("-");
        const dataInicio = `${d}/${m}/${y}`;

        const [year, month, day] = value.data_fim.split("-");
        const dataFim = `${day}/${month}/${year}`;
        
        temp.push({
          id:index,
          nome_turma:value.nome_turma,
          codigo: value.codigo,
          capacidade_turma: value.capacidade_turma,
          inicio_aula: value.inicio_aula,
          fim_aula: value.fim_aula,
          data_inicio: dataInicio,
          data_fim: dataFim,
          fk_curso: value.fk_curso,
          fk_professor: value.fk_professor,
          descricao: value.descricao
        });
    });
    }
    //console.log("O temp:"+temp[0].capacidade_turma);

    setDataTable(temp);
  });

  const deleteTurmas = async () => {
    console.log(selectedTurma.toString())
    const response = await apagarTurmas(selectedTurma.toString());

    if (response.status === 204) {
      toast.success("Turma excluída com sucesso!");
    } else {
      toast.error("Erro ao excluir a turma.");
    }
    
    handleCloseConfirmation();
    queryClient.invalidateQueries("listar_turmas");
  
  };

  const carregarTurmas = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });

    const turma = response as TurmasListarDTO;

    setTurma(turma);
    setValue("nomeTurmaEdit", turma.nome_turma);
    setValue("codigoTurmaEdit", turma.codigo);
    setValue("capacidadeTurmaEdit",turma.capacidade_turma);
    setValue("inicioAulaTurmaEdit", turma.inicio_aula);
    setValue("fimAulaTurmaEdit", turma.fim_aula);
    setValue("dataInicioTurmaEdit",turma.data_inicio);
    setValue("dataFimTurmaEdit",turma.data_fim);
    setValue("descricaoEdit",turma.descricao);

    setOpenEdit(true);
  };

  const editTurmas = async (data: any) => {    

    if (compareDates(data.inicioAulaTurmaEdit, turma.fimAulaTurmaEdit) > 0 ) {
      // Datas inválidas, tratar o erro ou fornecer feedback ao usuário
      toast.error("A data de início deve ser anterior à data de fim.");
      return;
    }
    

    if (!validateHorarios(data.inicioAulaTurmaEdit, data.fimAulaTurmaEdit)) {
      // Datas inválidas, tratar o erro ou fornecer feedback ao usuário
      toast.error(
        "O horário de início deve ser anterior ao horário de término e deve estar entre 00:00h e 23:59h"
      );
      return;
    }

    if (data.capacidadeTurmaEdit <= 0) {
      toast.error("A capacidade_turma deve ser um número maior que 0.");
      return;
    }

    data.dataInicioTurmaEdit = transformDate(data.dataInicioTurmaEdit);
    data.dataFimTurmaEdit = transformDate(data.dataFimTurmaEdit);


    const turmaEdit = {
      codigo: data.codigoTurmaEdit,
      fk_curso: turma.fk_curso,
      fk_professor: turma.fk_professor,
      nome_turma: data.nomeTurmaEdit,
      capacidade_turma: data.capacidadeTurmaEdit,
      inicio_aula: data.inicioAulaTurmaEdit,
      fim_aula: data.fimAulaTurmaEdit,
      data_inicio: data.dataInicioTurmaEdit,
      data_fim: data.dataFimTurmaEdit,
      descricao: data.descricaoEdit
    } as TurmasCadastrarDTO;


    const response = await editarTurmas(id.toString(), turmaEdit);
    if (response.status === 200 || response.status === 201) {
      toast.success("Turma atualizada com sucesso!");
    } else {
      toast.error("Erro na atualização da turma.");
    }
    setOpenEdit(false);

    await queryClient.invalidateQueries("listar_turmas");
  };

  const matriculaAluna = async (idDaTurma: number, idDaAluna: String) => {
    const turmaMatricula = {
      idTurma: idDaTurma,
      idAluna: String(idDaAluna),
    } as unknown as TurmasMatricularDTO;

    if (matriculas.length > vagas?.vagasDisponiveis!) {
      toast.error("Quantidade de vagas excedida.");
    } else {
      const response = await cadastrarAluna(turmaMatricula);
      if (response.status === 201) {
        toast.success("Aluna(s) matriculada(s) com sucesso!");
        queryClient.invalidateQueries("listar_alunas");
      }
      setOpenMatricula(false);
    }
  };

  const desmatAluna = async (idTurma: number, idAluna: number) => {
    const response = await desmatricularAluna(idTurma, idAluna);
    if (response.status === 204) {
      toast.success("Aluna(s) removida(s) da turma com sucesso!");
      setOpenList(false);
    } else {
      toast.error("Erro na remoção da(s) aluna(s) da turma.");
    }
    handleDesmatCloseConfirmation();
    useQuery("consultaAlunasNaTurma", async () => {
      //await consultaAlunasNaTurma(idTurma);
    });
  };

  const columnsTableAlunas = [
    { field: "nome", headerName: "Nome", flex: 2 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "dNascimento", headerName: "Data de Nascimento", flex: 1 },
    {
      field: "actions",
      headerName: "Desmatricular",
      type: "actions",
      flex: 1,
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
    const response = await listarAlunasNaTurma(idTurma);
    if (response.status === 200) {
      setAlunasTurma(response.data);
    } else {
      setAlunasTurma([]);
    }
  };

  useQuery("listar_alunas", async () => {
    /*const response = await listarAlunas();
    const temp: AlunasListarDTO[] = [];
    if (response.status === 200) {
      response.data.forEach((value: AlunasListarDTO, index: number) => {
        temp.push({
          id: index,
          login: value.login,
          nome: value.nome,
          cpf: value.cpf,
          data_nascimento: value.data_nascimento,
        });
      });
      setDataTableAlunas(temp);
    } else {
      setDataTableAlunas(temp);
    }*/
  });

  const listarIDTurma = async (idDaTurma: number) => {
    setIdTurma(idDaTurma);
  };

  const listarIDAluna = async (idDaAluna: number) => {
    setIdAluna(idDaAluna);
  };

  const listarVagas = async (idTurmaVagas: number) => {
    const response = await listarVagasTurma(idTurmaVagas);
    if (response.status === 200) {
      setVagas(response.data as VagasListarDTO);
    }
  };

  const columnsTable = [
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 1,
      width: 50,
      getActions: (params:any) => [
        <IconButton
          id="meu-grid-actions-cell-item"
          data-testid="teste-editar"
          onClick={async () => {
            carregarTurmas(params.id);
            setCodigo(params.id);
          }}
        >
          <AiFillEdit size={20} />
          <Typography variant="body2"></Typography>
        </IconButton>,

        <IconButton
          data-testid="teste-excluir"
          onClick={() => {
            setId(params.id);
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);
            if (selectedRow) {
              setSelectedTurma((selectedRow as any).codigo);
              handleOpenConfirmation();
            }
          }}
        >
          <BsFillTrashFill size={18} />
          <Typography variant="body2"></Typography>
        </IconButton>,
      ],
    },
    { field: "nome_turma", headerName: "Turma", width: 150 },
    { field: "capacidade_turma", headerName: "Número de vagas", width: 135 },
    { field: "inicio_aula", headerName: "Horário de Início", width: 120 },
    { field: "fim_aula", headerName: "Horário de Término", width: 140 },
    { field: "data_inicio", headerName: "Data de Início", width: 120 },
    { field: "data_fim", headerName: "Data de Término", width: 120 },
  ];

  return (
    <Container>
      {" "}
      <Sidebar />
      <Content>
        <Navbarlog text={"Turmas"} />
        <DivButtons>
          {role !== "student" ? (
            <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
          ) : (
            <></>
          )}
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
          <FormProvider {...methods}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(registerTurmas)}>
              <TextField
                id="outlined-codigo"
                required={true}
                label="Código"
                {...register("codigo")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-curso"
                required={true}
                label="Curso"
                {...register("fk_curso")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-turma"
                label="Nome da Turma"
                required={true}
                {...register("nome_turma")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-capacidade_turma"
                label="Número de vagas"
                required={true}
                inputProps={{ type: "number", maxLength: 3 }}
                {...register("capacidade_turma")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />

              <ValueMask label="data_inicio" />
              <ValueMask label="data_fim" />
              <ValueMask label="inicio_aula" />
              <ValueMask label="fim_aula" />

              <TextField
                id="outlined-professor"
                required={true}
                label="Professor"
                {...register("fk_professor")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-descricao"
                label="Descrição"
                {...register("descricao")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              
            
              <PrimaryButton text={"Cadastrar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
        <FormText>Altere os dados da turma.</FormText>
                  

          <Form onSubmit={handleSubmit(editTurmas)}>
            <TextField
              id="outlined-turma"
              label="Nome da Turma"
              defaultValue={turma.nome_turma}
              required={true}
              {...register("nomeTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            {/* <TextField
              id="outlined-descricao"
              label="Descrição"
              required={true}
              {...register("descricaoTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            /> */}
            <TextField
              id="outlined-capacidade_turma"
              label="Número de vagas"
              required={true}
              {...register("capacidadeTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-data_inicio"
              label="Data de Início"
              required={true}
              {...register("dataInicioTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-data_fim"
              label="Data de Término"
              required={true}
              {...register("dataFimTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-inicio_aula"
              label="Horário de Inicio"
              required={true}
              {...register("inicioAulaTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-fim_aula"
              label="Horário de Término"
              required={true}
              {...register("fimAulaTurmaEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-descricao"
              label="Descrição"
              required={true}
              {...register("descricaoEdit")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Editar"} />
          </Form>
        </Box>
      </Modal>
      <Modal open={openList} onClose={() => setOpenList(false)}>
        <Box sx={style} style={{ width: 900 }}>
          <FormProvider {...methods}>
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
            {/* <DataGrid
              rows={alunasTurma}
              columns={columnsTableAlunas}
              pageSize={10}
              rowsPerPageOptions={[10]}
            /> */}
            <div
              style={{ justifyContent: "center", display: "flex", marginTop: 20 }}
            >
              <PrimaryButton
                text={"Fechar"}
                handleClick={() => setOpenList(false)}
              />
            </div>
          </FormProvider>
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
          {/* <DataGrid
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
            }}
          /> */}

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
