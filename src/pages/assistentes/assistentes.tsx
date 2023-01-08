import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { Box, Modal, TextField } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AssistentesListarDTO } from "./dtos/AssistentesListarDTO";
import { AssistentesCadastrarDTO } from "./dtos/AssistentesCadastrarDTO";

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const cadastrarAssistentes = async (data: any) => {
    const assistente = {
      nome: data.nome,
      nomeSocial: data.nome,
      cpf: data.cpf,
      dNascimento: data.dNascimento,
      idEndereco: 1,
      senha: data.senha,
      admin: data.admin,
      login: data.login,
      obs: data.obs,
      email: data.email,
    } as AssistentesCadastrarDTO;

    console.log(assistente);

    await axios
      .post(
        "https://amis-service-stg.azurewebsites.net/assistentes/",
        assistente
      )
      .then((response) => {
        console.log(response.status);
        handleClose();
      })
      .catch((err) => console.warn(err));
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
        <Navbarlog />
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
              {...register("nome")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-dNascimento"
              label="Data de Nascimento"
              {...register("dNascimento")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-email"
              label="Email"
              {...register("email")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-senha"
              label="Senha"
              {...register("senha")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-cpf"
              label="CPF"
              {...register("cpf")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <TextField
              id="outlined-obs"
              label="Observações"
              {...register("obs")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <PrimaryButton text={"Cadastrar"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
