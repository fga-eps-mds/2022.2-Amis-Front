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
} from "@mui/material";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { useState, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  cadastrarCentro,
  editarCentro,
  excluirCentro,
  listarCentro,
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
import { VagasCentroProdutivoDTO } from "./dtos/VagasCentroProdutivo";

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const methods = useForm();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [Centro, setCentro] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  // const para alterar vagas disponiveis
  const [vagas, setVagas] = useState<VagasCentroProdutivoDTO>();
  const [codigoCentro, setcodigoCentro] = useState<GridRowId>(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const { role } = useContext(AuthContext);

  const registerCentro = async (data: any) => {
    const dataFormatada = transformDate(data.data_agendada);
    const centro = {
      data_agendada: dataFormatada,
      descricao: data.descricao,
      status: data.status,
      turno: data.turno,
      vagas: data.vagas,
    } as CentrosCadastrarDTO;
    console.log(data);
    const response = await cadastrarCentro(centro);

    if (response.status === 201) {
      setOpen(false);
      queryClient.invalidateQueries("listar_centro");
      toast.success("Centro cadastrado com sucesso!");
    } else {
      toast.error("Campos inválidos");
    }
  };

  useQuery("listar_centro", async () => {
    // const response = await listarCentro();
    const response = { data: [] };

    const temp: CentrosListarDTO[] = [
      {
        id: 21,
        data_agendada: "13/08/2004",
        descricao: "mario me comeu no armario",
        status: true,
        turno: 1,
        vagas: 12,
      },
    ];
    response.data.forEach((value: CentrosListarDTO, index: number) => {
      console.log(value);
      temp.push({
        id: value.id,
        data_agendada: value.data_agendada,
        descricao: value.descricao,
        status: value.status,
        turno: value.turno,
        vagas: value.vagas,
      });
    });
    setDataTable(temp);
  });
/* 
  const fazInscricao = () => {
    // Verifique se ainda há vagas disponíveis
    if (vagasDisponiveis > 0) {
      // Diminua o número de vagas disponíveis em 1
      setVagasDisponiveis(vagasDisponiveis - 1);
    }
  };
 */
  const deletarCentro = async () => {
    const response = await excluirCentro(id.toString());

    if (response.status === 204) {
      toast.success("Centro excluído com sucesso!");
    } else {
      toast.error("Erro ao excluir urso");
    }

    handleCloseConfirmation();
    await queryClient.invalidateQueries("listar_centro");
  };
  const carregarCentro = async (id: any) => {
    const response = dataTable.find((element: any) => {
      if (element.id === id) {
        return element;
      }
    });
    const centro = response as CentrosListarDTO;
    setCentro(centro);
    setValue("idEdit", centro.id);
    setValue("data_agendadaEdit", centro.data_agendada);
    setValue("descricaoEdit", centro.descricao);
    setValue("statusEdit", centro.status);
    setValue("turnoEdit", centro.turno);
    setValue("vagasEdit", centro.vagas);
    setOpenEdit(true);
  };

  const editCentro = async (data: any) => {
    const centroEditado = {
      id: Centro.id,
      data_agendada: data.data_agendadaEdit,
      descricao: data.descricaoEdit,
      status: data.statusEdit,
      turno: data.turnoEdit,
      vagas: data.vagas.Edit,
    };

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

  const columnsTableCentros = [
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
            carregarCentro(params.id);
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
    { field: "id", headerName: "Centro Produtivo", flex: 2 },
    { field: "descricao", headerName: "Descrição", flex: 2 },
    { field: "data_agendada", headerName: "Data de Alocação", flex: 2 },
    { field: "status", headerName: "Status", flex: 2 },
    { field: "turno", headerName: "Turno", flex: 2 },
    { field: "vagas", headerName: "Vagas", flex: 2 },
    { field: "inscricao",
      headerName: "Inscrições",
      type: "actions",
      flex: 2,
      getActions: (params: { id: GridRowId }) => [
        <Button
          // onClick={() => handleOpen()}
        >
          Inscrever-me
        </Button>
      ],
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
              text={"Agendar nova Produção"}
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
                {...register("vagas")}
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
    </Container>
  );
}
