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
  import { useForm } from "react-hook-form";
  import { AiFillEdit } from "react-icons/ai";
  import {
    BsFillTrashFill
  } from "react-icons/bs";
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
  import Sidebar from "../../shared/components/Sidebar/sidebar";
  import DataTable from "../../shared/components/TablePagination/tablePagination";
  import { CentrosCadastrarDTO } from "./dtos/CentrosCadastrar.dto";
  import { CentrosListarDTO } from "./dtos/CentrosListar.dto";
  import { AuthContext } from "../../context/AuthProvider";
  import ValueMask from "../../shared/components/Masks/ValueMask";
  
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
    height: "50%",
    overflow: "hidden",
    overflowY: "scroll",
  };
  
  export function CentroProdutivo() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenConfirmation = () => setOpenConfirmation(true);
    const handleCloseConfirmation = () => setOpenConfirmation(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [Centro, setCentro] = useState(Object);
    const [id, setId] = useState<GridRowId>(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataTable, setDataTable] = useState(Array<Object>);
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm();
    const { role } = useContext(AuthContext);
  
    const registerCentro = async (data: any) => {
      const centro = {
        data_agendada: data.data_agendada,
        descricao: data.descricao,
        status: data.status,
        turno : data.turno
      } as CentrosCadastrarDTO;
  
      const response = await cadastrarCentro(centro);
  
      if (response.status === 201) {
        setOpen(false);
        queryClient.invalidateQueries("listar_centro");
        toast.success("Centro cadastrado com sucesso!");
      }
    };
  
    useQuery("listar_centro", async () => {
      const response = await listarCentro();
  
      const temp: CentrosListarDTO[] = [];
      response.data.forEach((value: CentrosListarDTO, index: number) => {
        console.log(value);
        temp.push({
          id: value.id,
          data_agendada: value.data_agendada,
          descricao: value.descricao,
          status: value.status,
          turno : value.turno,
        });
      });
      setDataTable(temp);
    });
  
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
      setValue("dataAlocacaoEdit", centro.data_agendada);
      setValue("descricaoEdit", centro.descricao);
      setValue("statusEdit", centro.status);
      setValue("turnoEdit", centro.turno);
      setOpenEdit(true);
    };
  
    const editCentro = async (data: any) => {
  
      const centroEditado = {
        id: data.idEdit,
        data_agendada: data.data_agendadaEdit,
        descricao: data.descricaoEdit,
        status: data.statusEdit,
        turno : data.turnoEdit,
      };
  
      const response = await editarCentro(centroEditado.id.toString(), centroEditado);
      if (response.status === 201) {
        try {
          await queryClient.invalidateQueries("listar_centro");
          setOpenEdit(false);
          toast.success("Centro editado com sucesso!");
        } catch (error) {
          // Handle the error
          //console.error(error);
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
      { field: "id", headerName: "Código", flex: 2 },
      { field: "descricao", headerName: "Descrição", flex: 2 },
      { field: "data_agendada", headerName: "Data de Alocação", flex: 2 },
      { field: "status", headerName: "Status", flex: 2 },
      { field: "turno", headerName: "Turno", flex: 2 },
    ];
  
    return (
      <Container>
        {" "}
        <Sidebar />
        <Content>
          <Navbarlog text={"Centros Produtivos"} />
          <DivButtons>
          {role !== "student" ? (
              <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
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
              <ValueMask label="data_nascimento" />
              
              <PrimaryButton text={"Confirmar"} />
            </Form>
          </Box>
        </Modal>
        <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
          <Box sx={style}>
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
              <PrimaryButton text={"Editar"} />
            </Form>
          </Box>
        </Modal>
      </Container>
    );
  }