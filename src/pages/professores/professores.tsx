import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { queryClient } from "../../services/queryClient";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";

import {
  Box,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";

import { ProfessoresListarDTO } from "./dtos/ProfessoresListar.dto";
import { ProfessoresCadastrarDTO } from "./dtos/ProfessoresCadastrar.dto";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import {
  cadastraProfessor,
  listaProfessores,
  apagaProfessor,
  editaProfessor,
} from "../../services/professores";

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

export function Professores() {
    const [open, setOpen] = useState(false);
    const [professor, setProfessor] = useState(Object);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [dataTable, setDataTable] = useState(Array<Object>);
    const [id, setId] = useState<GridRowId>(0);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenConfirmation = () => setOpenConfirmation(true);
    const handleCloseConfirmation = () => setOpenConfirmation(false);
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
  
    const cadastrarProfessores = async (data: any) => {
      const professor = {
        nome: data.nome,
        nomeSocial: data.nomeSocial,
        cpf: data.cpf,
        rg: data.rg,
        dNascimento: data.dNascimento,
        nomePai: data.nomePai,
        nomeMae: data.nomeMae,
        deficiencia: data.deficiencia,
        idEndereco: 1,
      } as ProfessoresCadastrarDTO;
  
      const response = await cadastraProfessor(professor);
      if (response.status === 201) {
        handleClose();
        toast.success("Professor cadastrada com sucesso!");
      } else {
        toast.error("Erro ao cadastrar a professor.");
      }
      await queryClient.invalidateQueries("listar_professores");
    };
  
    useQuery("listar_professores", async () => {
      const response = await listaProfessores();
      const temp: ProfessoresListarDTO[] = [];
      response.data.forEach((value: ProfessoresListarDTO) => {
        temp.push({
          id: value.id,
          nome: value.nome,
          cpf: value.cpf,
          dNascimento: value.dNascimento,
        });
      });
      setDataTable(temp);
    });
  
    const deleteProfessores = async () => {
      const response = await apagaProfessor(id.toString());
      if (response.status === 204) {
        toast.success("Professor excluído com sucesso!");
      } else {
        toast.error("Erro ao excluir professor.");
      }
      handleCloseConfirmation();
      await queryClient.invalidateQueries("listar_professores");
    };
  
    const editProfesores = async (data: any) => {
      // eslint-disable-next-line array-callback-return
      const professor = {
        nome: data.nome,
        nomeSocial: data.nomeSocial,
        cpf: data.cpf,
        rg: data.rg,
        dNascimento: data.dNascimento,
        nomePai: data.nomePai,
        nomeMae: data.nomeMae,
        deficiencia: data.deficiencia,
        idEndereco: 1,
      } as ProfessoresCadastrarDTO;
  
      const response = await editaProfessor(id.toString(), professor);
      if (response.status === 200 || response.status === 204) {
        toast.success("Professor atualizado com sucesso!");
      } else {
        toast.error("Erro na atualização do professor.");
      }
      setOpenEdit(false);
      await queryClient.invalidateQueries("listar_professores");
    };
  
    const columnsTable = [
      { field: "nome", headerName: "Nome", flex: 2 },
      { field: "cpf", headerName: "CPF", flex: 2 },
      { field: "dNascimento", headerName: "Data Nascimento", flex: 2 },
      {
        field: "actions",
        headerName: "Ações",
        type: "actions",
        flex: 1,
        getActions: (params: { id: GridRowId }) => [
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
        <Sidebar />
        <Content>
          <Navbarlog text={"Professores"} />
          <DivButtons>
            <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
            {/* <PrimaryButton text={"Editar"} /> */}
          </DivButtons>
          <DataTable data={dataTable} columns={columnsTable} />
          <Dialog
            open={openConfirmation}
            onClose={setOpenConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Você tem certeza que deseja excluir este professor?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseConfirmation}>Não</Button>
              <Button onClick={deleteProfessores} autoFocus>
                Sim
              </Button>
            </DialogActions>
          </Dialog>
        </Content>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <FormText id="cabecalho">
              Preencha corretamente os dados cadastrais.
            </FormText>
            <Form onSubmit={handleSubmit(cadastrarProfessores)}>
              <TextField
                id="outlined-nome"
                label="Nome"
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nome"
                label="Nome Social"
                {...register("nomeSocial")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-cpf"
                label="CPF (apenas números)"
                inputProps={{ maxLength: 11 }}
                {...register("cpf")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-rg"
                label="RG"
                {...register("rg")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-dNascimento"
                label="Data de Nascimento"
                {...register("dNascimento")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nome-pai"
                label="Nome do pai"
                {...register("nomePai")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nome-mae"
                label="Nome da mãe"
                {...register("nomeMae")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Possui deficiência?
                </InputLabel>
                <Select
                  id="simple-select-label-deficiencia"
                  labelId="simple-select-deficiencia"
                  label="Possui deficiência?"
                  {...register("deficiencia")}
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
            <FormText>Altere os dados do professor.</FormText>
            <Form onSubmit={handleSubmit(editProfesores)}>
              <TextField
                id="outlined-nome"
                label="Nome"
                defaultValue={professor.nome}
                required={true}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nomeSocial"
                label="Nome Social"
                required={true}
                inputProps={{ maxLength: 120 }}
                defaultValue={professor.nomeSocial}
                {...register("nomeSocial")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-cpf"
                label="CPF (apenas números)"
                required={true}
                inputProps={{ maxLength: 11 }}
                defaultValue={professor.cpf}
                {...register("cpf")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-rg"
                label="RG"
                defaultValue={professor.rg}
                required={true}
                {...register("rg")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-dNascimento"
                label="Data de Nascimento"
                defaultValue={professor.dNascimento}
                required={true}
                {...register("dNascimento")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nomePai"
                label="Nome do Pai"
                defaultValue={professor.nomePai}
                required={true}
                {...register("nomePai")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-nomeMae"
                label="Nome da Mãe"
                defaultValue={professor.nomeMae}
                required={true}
                {...register("nomeMae")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Deficiência?
                </InputLabel>
                <Select
                  id="simple-select-label-deficiencia"
                  labelId="simple-select-deficiencia"
                  required={true}
                  defaultValue={professor.deficiencia}
                  label="Possui deficiência?"
                  {...register("deficiencia")}
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
      </Container>
    );
  }