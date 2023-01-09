import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import {
  Box,
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
import { AssistentesListarDTO } from "./dtos/AssistentesListarDTO";
import { AssistentesCadastrarDTO } from "./dtos/AssistentesCadastrarDTO";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
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

export function Assistentes() {
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = React.useState<Dayjs | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  type Row = typeof dataTable[number];

  const [rows, setRows] = React.useState<Row[]>(dataTable);

  const cadastrarAssistentes = async (data: any) => {
    const assistente = {
      id: Math.random(),
      nome: data.nome,
      dNascimento: dayjs(dateValue)?.format("DD-MM-YYYY"),
      login: data.login,
      senha: data.senha,
      obs: data.obs,
      admin: data.admin,
    } as unknown as AssistentesCadastrarDTO;

    console.log(assistente);
    setDataTable([...dataTable, assistente]);

    // await axios
    //   .post(
    //     "https://amis-service-stg.azurewebsites.net/assistentes/",
    //     assistente
    //   )
    //   .then((response) => {
    //     console.log(response.status);
    //     handleClose();
    //   })
    //   .catch((err) => console.warn(err));
  };

  useQuery("listar_assistentes", async () => {
    const response = await axios.get(
      "https://amis-service-stg.azurewebsites.net/assistentes/"
    );

    const temp: AssistentesListarDTO[] = [];
    response.data.forEach((value: AssistentesListarDTO) => {
      temp.push({
        id: value.id,
        nome: value.nome,
        dNascimento: value.dNascimento,
        obs: value.obs,
        admin: value.admin,
      });
    });

    setDataTable(temp);
  });

  const deleteUser = (id: GridRowId) => {
    console.log(id);
  };

  const columnsTable = [
    { field: "nome", headerName: "Nome", width: 150 },
    {
      field: "dNascimento",
      headerName: "Data Nascimento",
      width: 150,
      type: "date",
    },
    { field: "obs", headerName: "Observações", width: 150 },
    {
      field: "admin",
      headerName: "Administrador(a)",
      width: 150,
      type: "boolean",
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: { id: GridRowId }) => [
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<BsFillTrashFill size={18} />}
          label="Deletar"
          onClick={() => deleteUser(params.id)}
          // showInMenu
        />,
        // eslint-disable-next-line react/jsx-key
        <GridActionsCellItem
          icon={<AiFillEdit size={20} />}
          label="Editar"
          onClick={() => deleteUser(params.id)}
          // showInMenu
        />,
      ],
    },
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Assistentes"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar"} handleClick={handleOpen} />
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTable} />
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText>Preencha corretamente os dados cadastrais.</FormText>
          <Form onSubmit={handleSubmit(cadastrarAssistentes)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              required={true}
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de nascimento"
                value={dateValue}
                onChange={(newValue) => {
                  setDateValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    required={true}
                    sx={{
                      width: "100%",
                      background: "#F5F4FF",
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-login"
              label="Login"
              required={true}
              {...register("login")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-senha"
              label="Senha"
              type="password"
              required={true}
              {...register("senha")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-Observações"
              label="Observações"
              {...register("obs")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Administrador(a)?
              </InputLabel>
              <Select
                id="simple-select-label-admin"
                labelId="simple-select-admin"
                required={true}
                label="Administrador(a)?"
                {...register("admin")}
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
    </Container>
  );
}
