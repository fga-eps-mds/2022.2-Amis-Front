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
import { AlunasListarDTO } from "./dtos/AlunasListarDTO";
import { AlunasCadastrarDTO } from "./dtos/AlunasCadastrarDTO";
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
};

export function Alunas() {
  const [open, setOpen] = useState(false);
  const [aluna, setAluna] = useState(Object);
  const [id, setId] = useState<GridRowId>(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
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

  const cadastrarAlunas = async (data: any) => {
    const aluna = {
      id: Math.random(),
      nome: data.nome,
      nomeSocial: data.nome,
      cpf: data.cpf,
      rg: data.rg,
      dNascimento: data.dNascimento,
      nomePai: data.nomePai,
      nomeMae: data.nomeMae,
      deficiencia: data.deficiencia,
      idEndereco: 1,
    } as unknown as AlunasCadastrarDTO;

    setDataTable([...dataTable, aluna]);
    setOpen(false);
    console.log(aluna);

    // await axios
    //   .post("https://amis-service-stg.azurewebsites.net/alunas/", aluna)
    //   .then((response) => {
    //     console.log(response.status);
    //     handleClose();
    //   })
    //   .catch((err) => console.warn(err));
  };

  const deleteAlunas = async () => {
    console.log("Id excluido", id);
    setOpenConfirmation(false);
    // await axios
    //   .delete("https://amis-service-stg.azurewebsites.net/alunas/", id)
    //   .then((response) => {
    //     console.log(response.data);
    //     handleCloseConfirmation();
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     handleCloseConfirmation();
    //   });
  };

  const editAlunas = async (data: any) => {
    // eslint-disable-next-line array-callback-return
    dataTable.find((element: any) => {
      if (element.id === id) {
        const aluna = {
          name: data.nome,
          cpf: data.cpf,
          rg: data.rg,
          dNascimento: data.dNascimento,
          nomePai: data.nomePai,
          nomeMae: data.nomeMae,
          deficiencia: data.deficiencia,
        };
        element = aluna;
        console.log('element', element);
        setAluna(aluna);
        setOpenEdit(false);
      }
    });

    // await axios
    //   .delete("https://amis-service-stg.azurewebsites.net/alunas/", id)
    //   .then((response) => {
    //     console.log(response.data);
    //     handleCloseConfirmation();
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     handleCloseConfirmation();
    //   });
  };

  // useQuery("listar_alunas", async () => {
    // const response = await axios.get(
    //   "https://amis-service-stg.azurewebsites.net/alunas/"
    // );

    // const temp: AlunasListarDTO[] = [];
    // response.data.forEach((value: AlunasListarDTO) => {
    //   temp.push({
    //     id: value.id,
    //     nome: value.nome,
    //     cpf: value.cpf,
    //     dNascimento: value.dNascimento,
    //   });
    // });

    // setDataTable(temp);
  // });

  const columnsTable = [
    { field: "nome", headerName: "Nome", width: 350 },
    { field: "cpf", headerName: "CPF", width: 300 },
    { field: "dNascimento", headerName: "Data Nascimento", width: 250 },
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
    }
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Alunas"} />
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
            {"Você tem certeza que deseja excluir essa aluna?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirmation}>Não</Button>
            <Button onClick={deleteAlunas} autoFocus>
              Sim
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText>Preencha corretamente os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(cadastrarAlunas)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
              required={true}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-rg"
              label="RG"
              required={true}
              {...register("rg")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dNascimento"
              label="Data de Nascimento"
              required={true}
              {...register("dNascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-nome-pai"
              label="Nome do pai"
              required={true}
              {...register("nomePai")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-nome-mae"
              label="Nome da mãe"
              required={true}
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
                required={true}
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
          <FormText>Altere os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(editAlunas)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              defaultValue={aluna.nome}
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
              required={true}
              inputProps={{ maxLength: 12 }}
              defaultValue={aluna.cpf}
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-rg"
              label="RG"
              required={true}
              inputProps={{ maxLength: 12 }}
              defaultValue={aluna.rg}
              {...register("rg")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dNascimento"
              label="Data de Nascimento"
              required={true}
              inputProps={{ maxLength: 12 }}
              defaultValue={aluna.dNascimento}
              {...register("dNascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-nome-pai"
              label="Nome do Pai"
              required={true}
              inputProps={{ maxLength: 12 }}
              defaultValue={aluna.nomePai}
              {...register("nomePai")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-nome-mae"
              label="Nome do Mãe"
              required={true}
              inputProps={{ maxLength: 12 }}
              defaultValue={aluna.nomeMae}
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
                required={true}
                defaultValue={aluna.admin}
                label="PossuiDeficiência?"
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