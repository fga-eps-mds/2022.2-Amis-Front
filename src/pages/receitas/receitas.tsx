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
import { ReceitasCadastrarDTO } from "./CadastrarReceita.dto";
import { ListarReceitaDTO } from "./ListarReceita.dto";
import axios, { formToJSON } from "axios";
import { toast } from "react-toastify";
import AddButton from "../../shared/components/InputButtons/AddButton";
import { getValue } from "@mui/system";
import { useQuery } from "react-query";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  padding: "50px",
  height: "80%",
  overflow: "hidden",
  overflowY: "scroll",
};

const FormText = styled.h1`
  color: #525252;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CamposInput = styled.div`

`;

const DivInput = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  input {
    width: 80%;
    height: 50px;
    outline-color: #267db7;
    border: 1.5px solid #b1b1b1;
    background-color: #f5f4ff;
    border-radius: 6px;
    padding-left: 10px;
    font-size: 16px;
  }
  a {
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
  const [dataTableReceitas, setDataTableReceitas] = useState(Array<Object>);
  const [ingre, setIngre] = useState([""]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  const registerReceitas = async (data: any) => {
    const tempIngredientes = [String];
    tempIngredientes.shift();
    Object.keys(data).some(function(key) {
      if (key.indexOf("ingrediente") == 0) {
        tempIngredientes.push(data[key]);
      }
    });
    console.log(tempIngredientes);
    const receita = {
      nome: data.nome,
      descricao: data.descricao,
      ingredientes: tempIngredientes,
      modo_preparo: data.modo_preparo,
    } as ReceitasCadastrarDTO;

    console.log(receita);

    /* await axios
      .post("https://service-amis.azurewebsites.net/receitas/", receita)
      .then((response) => {
        console.log(response.status);
        toast.success("Receita criada com sucesso!");
      })
      .catch((err) => console.warn(err)); */
  };

  /* useQuery("listar_receitas", async () => {
    const response = await axios.get(
      "https://service-amis.azurewebsites.net/receitas/"
    );

    const temp: ListarReceitaDTO[] = [];
    response.data.forEach((value: ListarReceitaDTO) => {
      temp.push({
        nome: value.nome,
        descricao: value.descricao,
        ingredientes: value.ingredientes,
        modo_preparo: value.modo_preparo,
      });
    });
    setDataTableReceitas(temp);
  }); */

  // Adiciona Inputs para Ingredientes
  function addInputIngred() {
    const tmpIngredient = ingre;
    tmpIngredient.push(`Elemento ${ingre.length}`);
    setIngre(tmpIngredient);
    console.log(ingre);
    /* return;

    const inputIng = document.getElementById("inpIngredGroup");

    const ingrediente = document.createElement("input");
    ingrediente.placeholder = "Ingrediente *";
    ingrediente.id = "ingr";
    ingrediente.required = true;

    const remBtn = document.createElement("a");
    remBtn.className = "remButton";
    remBtn.innerHTML = "-";
    remBtn.onclick = remInputIngred;

    function remInputIngred(this: any) {
      const apaga = document.getElementById("ingr");
      apaga!.remove();
      this.remove();
    }

    inputIng?.appendChild(ingrediente);
    inputIng?.appendChild(remBtn); */
  }

  // Adiciona Inputs para Modo de Preparo
  function addInputModPrep() {
    const inputPrep = document.getElementById("inpModPrepGroup");

    const ModPreparo = document.createElement("input");
    ModPreparo.placeholder = "Modo de Preparo *";
    ModPreparo.id = "prep";
    ModPreparo.required = true;

    const remBtn = document.createElement("a");
    remBtn.className = "remButton";
    remBtn.innerHTML = "-";
    remBtn.onclick = remInputPrep;

    function remInputPrep(this: any) {
      const apaga = document.getElementById("prep");
      apaga!.remove();
      this.remove();
    }

    inputPrep?.appendChild(ModPreparo);
    inputPrep?.appendChild(remBtn);
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
              paddingBottom: 20,
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
              id="outlined-desc_receita"
              label="Descrição"
              required={true}
              {...register("descricao")}
              sx={{ width: "100%", background: "#F5F4FF" }}
            />
            <Inputs>
              <FormText
                style={{
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: 20,
                }}
              >
                Ingredientes
              </FormText>
              <AddButton handleClick={addInputIngred} />
            </Inputs>
            {/* <CamposInput id="inpIngredGroup"> */}
              {ingre.map((value: string, index: number) => (
                <DivInput>
                  <input
                    id={String(index)}
                    key={index}
                    placeholder="Ingrediente *"
                    required={true}
                    {...register("ingrediente" + index)}
                  ></input>
                  <a style={{ borderRadius: 5 }}>-</a>
                </DivInput>
              ))}
            {/* </CamposInput> */}
            <Inputs>
              <FormText
                style={{
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: 20,
                }}
              >
                Modo de preparo
              </FormText>
              <AddButton handleClick={addInputModPrep} />
            </Inputs>
            <CamposInput
              id="inpModPrepGroup"
              {...register("modo_preparo")}
            ></CamposInput>
            <PrimaryButton text={"Cadastrar receita"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
