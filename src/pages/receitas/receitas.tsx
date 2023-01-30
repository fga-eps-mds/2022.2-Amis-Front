import React, { useState } from "react";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Title from "../../shared/components/Title/Title";
import { Footer } from "../../shared/components/Footer/footer";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { ReceitasCadastrarDTO } from "./ReceitasCadastrarDTO";
import axios from "axios";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
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

const FormText = styled.h1`
  color: #525252;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  padding-bottom: 25px;
`;

const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  flex-direction: column;
  padding: 45px 120px 120px 100px;
`;

const DivHeaderReceitas = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

const DivCards = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
`;

export function Receitas() {
  const [openCad, setOpenCad] = useState(false);
  const handleOpen = () => setOpenCad(true);
  const handleClose = () => setOpenCad(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  const registerReceitas = async (data: any) => {
    const receita = {
      nome: data.nome,
      ingredientes: data.ingredientes,
      modo_preparo: data.modo_preparo,
    } as ReceitasCadastrarDTO;

    await axios
      .post("https://service-amis.azurewebsites.net/receitas/", receita)
      .then((response) => {
        console.log(response.status);
        toast.success("Receita criada com sucesso!");
      })
      .catch((err) => console.warn(err));
  };

  return (
    <Container>
      <Navbar />
      <DivPresentation>
        <DivHeaderReceitas>
          <Title fontSize={40} fontWeight={600}>
            RECEITAS
          </Title>
          <PrimaryButton text={"Cadastrar receita"} handleClick={handleOpen} />
        </DivHeaderReceitas>
        <Modal open={openCad} onClose={handleClose}>
          <Box sx={style}>
            <FormText
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              Cadastrar uma nova receita
            </FormText>
            <Form onSubmit={handleSubmit(registerReceitas)}>
              <TextField
                id="outlined-nome_receita"
                label="Nome"
                required={true}
                {...register("nome")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-ingredientes"
                label="Ingredientes"
                required={true}
                {...register("ingredientes")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <TextField
                id="outlined-modo_preparo"
                label="Modo de Preparo"
                required={true}
                {...register("modo_preparo")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              />
              <PrimaryButton text={"Cadastrar receita"} />
            </Form>
          </Box>
        </Modal>
        <DivCards>
          <Card sx={{ maxWidth: 330, borderRadius: 7, padding: 2, margin: 2 }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Biscoito ou Bolacha
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quaerat laboriosam, asperiores fugiat quae ad corporis.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </DivCards>
      </DivPresentation>
      <Footer />
    </Container>
  );
}
