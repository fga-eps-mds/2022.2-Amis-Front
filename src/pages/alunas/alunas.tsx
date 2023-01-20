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
import { AlunasListarDTO } from "./dtos/AlunasListarDTO";
import { AlunasCadastrarDTO } from "./dtos/AlunasCadastrarDTO";

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const cadastrarAlunas = async (data: any) => {
    const aluna = {
      nome: data.nome,
      nomeSocial: data.nome,
      cpf: data.cpf,
      rg: data.rg,
      dNascimento: data.dNascimento,
      nomePai: data.nomePai,
      nomeMae: data.nomeMae,
      deficiencia: data.deficiencia,
      idEndereco: 1,
    } as AlunasCadastrarDTO;

    console.log(aluna);

    await axios
      .post("http://localhost:8080/alunas", aluna)
      .then((response) => {
        console.log(response.status);
        handleClose();
      })
      .catch((err) => console.warn(err));
  };

  useQuery("listar_alunas", async () => {
    const response = await axios.get("http://localhost:8080/alunas");

    const temp: AlunasListarDTO[] = [];
    response.data.forEach((value: AlunasListarDTO) => {
      temp.push({
        id: value.id,
        nome: value.nome,
        cpf: value.cpf,
        dNascimento: value.dNascimento,
      });
    });

    setDataTable(temp);
  });

  const columnsTable = [
    { field: "nome", headerName: "Nome", width: 150 },
    { field: "cpf", headerName: "CPF", width: 150 },
    { field: "dNascimento", headerName: "Data Nascimento", width: 150 },
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Navbarlog text={"Alunas"} />
        <DivButtons>
          <PrimaryButton text={"Cadastrar Aluno(a)"} handleClick={handleOpen} />
          {/* <PrimaryButton text={"Editar"} /> */}
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTable} />
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormText id="cabecalho">
            Preencha corretamente os dados cadastrais.
          </FormText>
          <Form onSubmit={handleSubmit(cadastrarAlunas)}>
            <TextField
              id="outlined-nome"
              label="Nome"
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
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
    </Container>
  );
}
