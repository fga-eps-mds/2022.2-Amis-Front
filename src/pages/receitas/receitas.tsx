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
import { ReceitasCadastrarDTO } from "./ReceitasCadastrarDTO";
import axios from "axios";
import { toast } from "react-toastify";
import AddButton from "../../shared/components/InputButtons/AddButton";

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
  height: "62%",
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

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const Container = styled.div`
  width: 100%;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CamposIngred = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  input {
    margin: 10px;
    width: 86%;
    height: 50px;
    outline-color: #267db7;
    border: 1.5px solid #b1b1b1;
    background-color: #f3f6f9;
    border-radius: 6px;
    padding-left: 10px;
    font-size: 16px;
  }
  button {
    width: 38px;
    height: 35px;
    border: none;
    font-size: 25px;
    cursor: pointer;
    font-weight: bold;
    color: #fff;
    background-color: #da4d3d;
    &:hover {
      background-color: #d2301e;
      color: #ddd;
    }
    display: flex;
    justify-content: center;
    align-items: center;
  }
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

  function addInput() {
    const inputG = document.getElementById("inpGroup");

    const ingrediente = document.createElement("input");
    ingrediente.placeholder = "Ingrediente";
    ingrediente.required = true;

    const remBtn = document.createElement("button");
    remBtn.className = "remButton";
    remBtn.innerHTML = "-";

    inputG?.appendChild(ingrediente);
    inputG?.appendChild(remBtn);
  }

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
            <Inputs>
              {/* <TextField
                id="outlined-ingredientes"
                label="Ingredientes"
                required={true}
                {...register("ingredientes")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              /> */}
              <FormText
                style={{
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: 20,
                }}
              >
                Ingredientes
              </FormText>

              <AddButton handleClick={addInput} />
            </Inputs>
            <CamposIngred id="inpGroup"></CamposIngred>
            <Inputs>
              {/* <TextField
                id="outlined-modo_preparo"
                label="Modo de Preparo"
                required={true}
                {...register("modo_preparo")}
                sx={{ width: "100%", background: "#F5F4FF" }}
              /> */}
              <FormText
                style={{
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: 20,
                }}
              >
                Modo de preparo
              </FormText>
              <AddButton handleClick={addInput} />
            </Inputs>
            <PrimaryButton text={"Cadastrar receita"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
