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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
// import { AuthContext, Roles } from "../../../context/AuthProvider";
import { Roles } from "../../context/AuthProvider";
import { GridActionsCellItem, GridRowId, DataGrid } from "@mui/x-data-grid";
import ActionButton from '../../shared/components/ActionButton/ActionButton'
import { useState, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { BsFillPersonDashFill, BsFillTrashFill } from "react-icons/bs";
import {RiCheckboxCircleFill} from "react-icons/ri";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  cadastrarCentro,
  editarCentro,
  inscreveAlunaCentro,
  excluirCentro,
  listarCentro,
  listarAlunasCentro,
  gerarRelatorio,
  confirmarAlunaCentro,
  cancelarInscricaoAlunaCentro,
} from "../../services/centroProdutivo";
import { queryClient } from "../../services/queryClient";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import ButtonAgendar from "../../shared/components/ButtonAgendar/ButtonAgendar";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { CentrosCadastrarDTO } from "./dtos/CentrosCadastrar.dto";
import { CentrosListarDTO } from "./dtos/CentrosListar.dto";
import { AuthContext } from "../../context/AuthProvider";
import ValueMask from "../../shared/components/Masks/ValueMask";
// import { VagasCentroProdutivoDTO } from "./dtos/VagasCentroProdutivo";
import { VagasListarCentroDTO } from "./dtos/VagasListarCentro.dto";
import { CentroInscritosDTO } from './dtos/CentroInscritosDTO';
import { FaList } from 'react-icons/fa';
// Estado inicial vazio

function transformDate(date: any) {
  const parts = date.split("/");
  const transformedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return transformedDate;
}

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
  height: "75%",
  overflow: "hidden",
  overflowY: "scroll",
};

export function CentroProdutivo() {
  const [listaDeAlunas, setListaDeAlunas] = useState<CentroInscritosDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const methods = useForm();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  // const [selectedCentro, setSelectedCentro] = useState(null);
  const [Centro, setCentro] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const [vaga, setVagas] = useState<VagasListarCentroDTO[]>([]);
  // const para alterar vagas disponiveis
  // const [inscrito, setInscrito] = useState(false);
  // const [codigoCentro, setcodigoCentro] = useState<GridRowId>(0);
  const auth = useContext(AuthContext);

  const [openList, setOpenList] = useState(false);
  const [openUnconfirmed, setOpenUnconfirmed] = useState(false);
  const [alunaToDelete, setAlunaToDelete] = useState<CentroInscritosDTO | null>(null);



  const handleCellValueChange = (params: any) => {
    const updatedRows = listaDeAlunas.map((row: any) => {
      if (row.id === params.id) {
        return { ...row, [params.field]: params.value };
      }
      return row;
    });

    setListaDeAlunas(updatedRows);
  };

  const handleOpenExportar = () => {
    setOpenExportar(true)
  }
  const handleCloseExportar = () => {
    setOpenExportar(false)
    console.log('Fechar tela de exportação')
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;
  const { role } = useContext(AuthContext);

  const salvarDadosRelatorio = async (dadosAlunas: any) => {
    const response = await gerarRelatorio(dadosAlunas);

    if (response.status === 201) {
      // setOpen(false)
      // queryClient.invalidateQueries('listar_centro')
      toast.success('Dados do relatorio salvos com sucesso!')
    } else {
      toast.error('Campos inválidos')
    }

  }

  const registerCentro = async (data: any) => {
    const dataFormatada = transformDate(data.data_agendada);
    console.log(data)
    const centro = {
      data_agendada: dataFormatada,
      descricao: data.descricao,
      status: data.status,
      turno: data.turno,
      vagas: data.vagasRestantes,
    } as CentrosCadastrarDTO;
    const response = await cadastrarCentro(centro);

    if (response.status === 201) {
      setOpen(false);
      queryClient.invalidateQueries("listar_centro");
      toast.success("Centro cadastrado com sucesso!");
      reset();
    } else {
      toast.error("Campos inválidos");
    }
  };

  useQuery("listar_centro", async () => {
    const response = await listarCentro();
    const vagasAtuais: VagasListarCentroDTO[] = [
      {
        vagasTotais: 0,
        vagasDisponiveis: 0,
      },
    ];

    const temp: CentrosListarDTO[] = [];
    response.data.forEach((value: CentrosListarDTO, index: number) => {
      temp.push({
        id: index,
        idCentro: value.id,
        data_agendada: value.data_agendada,
        descricao: value.descricao,
        status: value.status,
        turno: value.turno,
        vagasRestantes: value.vagasRestantes,
      });
      vagasAtuais[index] = {
        vagasTotais: value.vagasRestantes,
        vagasDisponiveis: value.vagasRestantes,
      };
      vagasAtuais[index] = {
        vagasTotais: value.vagasRestantes,
        vagasDisponiveis: value.vagasRestantes,
      };
    });
    setVagas(vagasAtuais);
    setDataTable(temp);
  });

  const fazInscricao = async (centroProd: CentrosListarDTO) => {
    // Verifique se ainda há vagas disponíveis
    // console.log("O que chegou aqui" + centroProd.idCentro);
    console.log("O que chegou aqui", centroProd);
    console.log("Login Aluno: ", auth);
    if (centroProd.vagasRestantes > 0) {
      const response = await inscreveAlunaCentro(
        centroProd.idCentro,
        auth.user?.email
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("Você foi cadastrada com sucesso!");
        await queryClient.invalidateQueries("listar_centro");
      } else {
        toast.warning("Você já está cadastrado!");
      }
    }
  };

  const alteraAgendamento = async (centroProd: CentrosListarDTO) => {
    if ((centroProd.vagasRestantes > 0) && (centroProd.status === 1)) {
      const centroEditado = {
        id: centroProd.idCentro,
        data_agendada: centroProd.data_agendada,
        descricao: centroProd.descricao,
        status: 2,
        turno: centroProd.turno,
        vagas: centroProd.vagasRestantes,
      };
      console.log(centroEditado);
      const response = await editarCentro(
        centroEditado.id.toString(),
        centroEditado
      );
      if (response.status === 201) {
        toast.success("Centro Desagendado com sucesso!");
        await queryClient.invalidateQueries("listar_centro");
      } else {
        toast.warning("Não foi possivel Desagendar esse Centro");
      }
    }
    if ((centroProd.vagasRestantes > 0) && (centroProd.status === 2)) {
      const centroEditado = {
        id: centroProd.idCentro,
        data_agendada: centroProd.data_agendada,
        descricao: centroProd.descricao,
        status: 1,
        turno: centroProd.turno,
        vagas: centroProd.vagasRestantes,
      };
      console.log(centroEditado.vagas);
      const response = await editarCentro(
        centroEditado.id.toString(),
        centroEditado
      );
      if (response.status === 201) {
        toast.success("Centro Agendado com sucesso!");
        await queryClient.invalidateQueries("listar_centro");
      } else {
        toast.warning("Não foi possivel Agendar esse Centro");
      }
    }
  };

  const deletarCentro = async () => {
    const response = await excluirCentro(id.toString());

    if (response.status === 204) {
      toast.success("Centro excluído com sucesso!");
    } else {
      toast.error("O centro produtivo não pode ser excluído, pois tem alunas cadastradas.");
    }

    handleCloseConfirmation();
    await queryClient.invalidateQueries("listar_centro");
  };

  const carregarAlunasDoCentro = async (idDoCentro: any) => {
    const response = await listarAlunasCentro(idDoCentro);
    const temp: any[] = [];
    response.data.forEach((value: any, index: number) => {

      temp.push({
        id: index,
        nome_aluno: value.nome,
        login: value.login,
        confirmado: value.confirmado,
        centroId: value.centroId,
      });
    });
    setListaDeAlunas(temp);
  };

  const carregarCentro = async (id: any) => {
    console.log("o id q chegou: " + id);
    const response = dataTable.find((element: any) => {
      if (element.idCentro === id) {
        return element
      }
    })
    const centro = response as CentrosListarDTO;
    setCentro(centro)
    console.log("Carregando o centro: " + centro);
    setValue('idEdit', centro.idCentro)
    setValue('vagasEdit', centro.vagasRestantes);
    setValue('data_agendadaEdit', centro.data_agendada)
    setValue('descricaoEdit', centro.descricao)
    setValue('statusEdit', centro.status)
    setValue('turnoEdit', centro.turno)
  }

  const editCentro = async (data: any) => {
    const centroEditado = {
      id: Centro.idCentro,
      data_agendada: data.data_agendadaEdit,
      descricao: data.descricaoEdit,
      status: data.statusEdit,
      turno: data.turnoEdit,
      vagas: data.vagasEdit,
    };
    console.log(centroEditado);

    const response = await editarCentro(
      centroEditado.id.toString(),
      centroEditado
    );
    if (response.status === 201) {
      try {
        await queryClient.invalidateQueries("listar_centro");
        setOpenEdit(false);
        toast.success("Centro editado com sucesso!");
      } catch (error) {
        toast.error("Campos inválidos");
      }
    }
  };
  async function handleCancelSubscription() {
    if(alunaToDelete === null) {
      return;
    }

    await cancelarInscricaoAlunaCentro(alunaToDelete.centroId, alunaToDelete.login);
    await carregarAlunasDoCentro(alunaToDelete.centroId);
    setOpenUnconfirmed(false);
  }

  const columnsTableCentros = [
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      flex: 4,
      hide: role === "student",
      getActions: (params: any) => [
        <IconButton key={1}
          id="meu-grid-actions-cell-item"
          data-testid="teste-editar"
          onClick={async () => {
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);

            carregarCentro((selectedRow as any).idCentro);
            setOpenEdit(true);
          }}
        >
          <AiFillEdit size={20} />
          <Typography variant="body2"></Typography>
        </IconButton>,

        <IconButton key={2}
          data-testid="teste-excluir"
          onClick={() => {
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);
            setId((selectedRow as any).idCentro);
            handleOpenConfirmation();
          }}
        >
          <BsFillTrashFill size={18} />
          <Typography variant="body2"></Typography>
        </IconButton>,

        <GridActionsCellItem key={3}
          icon={<FaList size={20} />}
          label="ListarAlunas"
          onClick={async () => {
            setOpenList(true);

            await carregarAlunasDoCentro(params.row.idCentro);
          }}
        />
      ],
    },
    { field: "idCentro", headerName: "Centro Produtivo", flex: 2 },
    { field: "descricao", headerName: "Descrição", flex: 2 },
    { field: "data_agendada", headerName: "Data de Alocação", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      valueGetter: (params: any) => {
        if (params.row.vagasRestantes <= 0) {
          return "Ocupado";
        } else {
          switch (params.row.status) {
          case 1:
            return "Disponível";
          case 2:
            return "Ocupado";
          default:
            return "";
          }
        }
      },
    },
    {
      field: "turno",
      headerName: "Turno",
      flex: 2,
      valueGetter: (params: any) => {
        switch (params.row.turno) {
        case 1:
          return "Matutino";
        case 2:
          return "Vespertino";
        case 3:
          return "Noturno";
        case 4:
          return "Diurno";
        default:
          return "";
        }
      },
    },
    { field: "vagasRestantes", headerName: "Vagas", flex: 2 },
    role === "student" && {
      field: "inscricao",
      headerName: "Inscrições",
      type: "actions",
      flex: 2,
      getActions: (params: any) => [
        <div>
          {vaga[Number(params.id)]?.vagasDisponiveis &&
            vaga[Number(params.id)].vagasDisponiveis >= 1 &&
            params.row.status === 1 &&
            role === "student" ? (
              <ActionButton
                text="Inscrever-me"
                handleClick={() => {
                  fazInscricao(params.row);
                }}
              />
            ) : (
              <></>
            )}
        </div>,
      ],
    },
    role === "supervisor" && {
      field: "Agendar",
      headerName: "Agendar",
      type: "actions",
      flex: 4,
      getActions: (params: { row: any; id: GridRowId }) => [
        <ActionButton
          key={params.id}
          text={'Exportar'}

          handleClick={() => {
            const selectedRow = dataTable.find((item) => (item as any).id === params.id);
            if (selectedRow) {
              // carregarCentro((selectedRow as any).idCentro);
              carregarAlunasDoCentro((selectedRow as any).idCentro);
              handleOpenExportar();
            }
            // queryClient.invalidateQueries('listar_alunas_cadastradas');

          }}
        ></ActionButton>,
        <div>
          {vaga[Number(params.id)]?.vagasDisponiveis &&
            vaga[Number(params.id)].vagasDisponiveis >= 1 &&
            params.row.status === 1 &&
            role === "supervisor" ? (
              <ActionButton
                text="Desagendar"
                handleClick={() => {
                  alteraAgendamento(params.row);
                }}
              />
            ) : vaga[Number(params.id)].vagasDisponiveis >= 1 && params.row.status === 2 ? (
              <ActionButton
                text="Agendar"
                handleClick={() => {
                  alteraAgendamento(params.row);
                }}
              />
            ) : null}
        </div>,
      ],
    },
  ].filter(Boolean);

  const columnsTableAlunasNoCentro = [
    { field: 'nome_aluno', headerName: 'Nome da Aluna', flex: 2 },
    {
      field: 'comentario',
      headerName: 'Comentario',
      flex: 2,
      renderCell: (params: any) => (
        <TextField
          // value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'comentario', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Frequencia',
      flex: 1,
      renderCell: (params: any) => (
        <TextField
          // value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'status', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'nota',
      headerName: 'Nota',
      flex: 1,
      renderCell: (params: any) => (
        <TextField
          // value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'nota', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'quantidade_produzida',
      headerName: 'Qtd Produzida',
      flex: 1,
      renderCell: (params: any) => (
        <TextField
          // value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'quantidade_produzida', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'quantidade_desejada',
      headerName: 'Qtd Desejada',
      flex: 1,
      renderCell: (params: any) => (
        <TextField
          // value={params.value}
          onChange={(e) => {
            handleCellValueChange({ id: params.row.id, field: 'quantidade_desejada', value: e.target.value });
          }}
          fullWidth
          variant="outlined"
          size="small"
        />
      ),
    },
  ];

  const columnsTableCentroInscritos = [
    { field: "nome_aluno", headerName: "Aluno", flex: 2 },
    {
      field: "actions",
      headerName: "Confirmar Inscrição",
      type: "actions",
      flex: 1,
      getActions: (params: { id: GridRowId, row: CentroInscritosDTO }) =>
        [ 
          <GridActionsCellItem key={2}
            disabled={params.row.confirmado}
            icon={<RiCheckboxCircleFill size={24}/>}
            label="Confirmar aluno em centro"
            onClick={async () => {
              await confirmarAlunaCentro(params.row.centroId, params.row.login);
              await carregarAlunasDoCentro(params.row.centroId);
            }}
          />,
          params.row.confirmado ? <></> :
            <GridActionsCellItem key={1}
              icon={<BsFillPersonDashFill size={24} />}
              label="Remover aluno do centro"
              onClick={async () => {
                setAlunaToDelete(params.row);
                setOpenUnconfirmed(true);
              }}
            />
        ]
    },
  ];

  return (
    <Container>
      {" "}
      <Sidebar />
      <Content>
        <Navbarlog text={"Centros Produtivos"} />
        <DivButtons>
          {role !== "student" ? (
            <ButtonAgendar
              text={"Agendar nova produção"}
              handleClick={handleOpen}
            />
          ) : (
            <></>
          )}
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTableCentros} />
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
            <Button onClick={deletarCentro} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openUnconfirmed}
          onClose={() => setOpenUnconfirmed(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Você deseja cancelar a inscrição deste aluno?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenUnconfirmed(false)}>Não</Button>
            <Button onClick={handleCancelSubscription} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText>Preencha corretamente os dados cadastrais.</FormText>
            <Form onSubmit={handleSubmit(registerCentro)}>
              <TextField
                id="outlined-descricao"
                label="Descrição"
                required={true}
                inputProps={{ maxLength: 500 }}
                {...register("descricao")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-vagas"
                label="Vagas"
                required={true}
                inputProps={{ maxLength: 500 }}
                {...register("vagasRestantes")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" required={true}>
                  Status
                </InputLabel>
                <Select
                  id="simple-select-label-status"
                  labelId="simple-select-status"
                  label="Status"
                  {...register("status")}
                  sx={{ width: "100%", background: "#F5F4FF" }}
                >
                  <MenuItem value={1 as any}>Disponível</MenuItem>
                  <MenuItem value={2 as any}>Ocupado</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" required={true}>
                  Turno
                </InputLabel>
                <Select
                  id="simple-select-label-turno"
                  labelId="simple-select-turno"
                  label="Turno"
                  {...register("turno")}
                  sx={{ width: "100%", background: "#F5F4FF" }}
                >
                  <MenuItem value={1 as any}>Matutino</MenuItem>
                  <MenuItem value={2 as any}>Vespertino</MenuItem>
                  <MenuItem value={3 as any}>Noturno</MenuItem>
                  <MenuItem value={4 as any}>Diurno</MenuItem>
                </Select>
              </FormControl>

              <ValueMask label="data_agendada" />

              <PrimaryButton text={"Confirmar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <FormProvider {...methods}>
            <FormText>Altere os dados cadastrados</FormText>
            <Form onSubmit={handleSubmit(editCentro)}>
              <TextField
                id="outlined-codigo"
                label="Código"
                required={true}
                disabled={true}
                {...register("idEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-descricao"
                label="Descrição"
                required={true}
                inputProps={{ maxLength: 170 }}
                {...register("descricaoEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-vagas"
                label="Vagas"
                required={true}
                inputProps={{ maxLength: 170 }}
                {...register("vagasEdit")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" required={true}>
                  Status
                </InputLabel>
                <Select
                  id="simple-select-label-status"
                  labelId="simple-select-status"
                  defaultValue={Centro.status}
                  label="Status"
                  {...register("statusEdit")}
                  sx={{ width: "100%", background: "#F5F4FF" }}
                >
                  <MenuItem value={1 as any}>Disponível</MenuItem>
                  <MenuItem value={2 as any}>Ocupado</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" required={true}>
                  Turno
                </InputLabel>
                <Select
                  id="simple-select-label-turno"
                  labelId="simple-select-turno"
                  label="Turno"
                  defaultValue={Centro.turno}
                  {...register("turnoEdit")}
                  sx={{ width: "100%", background: "#F5F4FF" }}
                >
                  <MenuItem value={1 as any}>Matutino</MenuItem>
                  <MenuItem value={2 as any}>Vespertino</MenuItem>
                  <MenuItem value={3 as any}>Noturno</MenuItem>
                  <MenuItem value={4 as any}>Diurno</MenuItem>
                </Select>
              </FormControl>

              <ValueMask label="data_agendadaEdit" />

              <PrimaryButton text={"Editar"} />
            </Form>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openExportar} onClose={() => setOpenExportar(false)}>
        <Box sx={style} style={{ width: 900 }}>
          <FormProvider {...methods}>
            <FormText
              style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
            >
              Relatório da Produção.
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
                </Table>
              </TableContainer>
            </div>
            {/* { TABELA DE ALUNAS NO CENTRO} */}
            {
              <DataGrid
                rows={listaDeAlunas}
                columns={columnsTableAlunasNoCentro}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            }
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginTop: 20,
              }}
            >
              <PrimaryButton
                text={"Exportar PDF"}
                handleClick={() => {
                  salvarDadosRelatorio(listaDeAlunas)
                  handleCloseExportar();
                }}
              />
            </div>
          </FormProvider>
        </Box>
      </Modal>
      <Modal open={openList} onClose={() => setOpenList(false)}>
        <Box sx={style} style={{ width: 900 }}>
          <FormProvider {...methods}>
            <FormText
              style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}
            >
              Alunos inscritos no centro produtivo
            </FormText>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginBottom: 50,
              }}
            >
            </div>

            {/* { TABELA DE ALUNOS INSCRITOS} */}
            <DataGrid
              rows={listaDeAlunas}
              columns={columnsTableCentroInscritos}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />

            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginTop: 20,
              }}
            >
              <PrimaryButton
                text={"Fechar"}
                handleClick={() => setOpenList(false)}
              />
            </div>
          </FormProvider>
        </Box>
      </Modal>
    </Container>
  );
}