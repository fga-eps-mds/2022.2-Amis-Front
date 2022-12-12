import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { Box, Modal } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";

export interface Repository {
  id: string;
  nome: string;
  cpf: string;
  dNascimento: string;
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

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

export function Alunas() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataTable, setDataTable] = useState(Array<Object>);

  useQuery("listar_alunas", async () => {
    const response = await axios.get(
      "https://amis-service-stg.azurewebsites.net/alunas/"
    );

    const temp: Repository[] = [];
    response.data.forEach((value: Repository) => {
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
          <PrimaryButton text={"Editar"} />
        </DivButtons>
        <DataTable data={dataTable} columns={columnsTable} />
      </Content>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}></Box>
      </Modal>
    </Container>
  );
}
