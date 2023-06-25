import React, { useContext, useState } from "react";
import { apiClassroom } from "../../services/api";
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
import { ReceitasCadastrarDTO } from "./dtos/CadastrarReceita.dto";
import { toast } from "react-toastify";
import AddButton from "../../shared/components/InputButtons/AddButton";
import { useQuery } from "react-query";
import { queryClient } from "../../services/queryClient";
import { useNavigate } from "react-router-dom";
import { ReceitasDTO } from "./dtos/receitas.dto";
import { ListarReceitaDTO } from "./dtos/ListarReceita.dto";
import { AuthContext } from "../../context/AuthProvider";

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
  justify-content: flex-start;
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
  const [dataTableReceitas, setDataTableReceitas] = useState(
    Array<ReceitasDTO>
  );
  const [ingre, setIngre] = useState([""]);
  const [prep, setPrep] = useState([""]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});
  const auth = useContext(AuthContext);

  useQuery("carregaReceitas", async () => {
    await apiClassroom.get("/receita/").then((response: any) => {
      const temp: ListarReceitaDTO[] = [];
      if (response.status === 200) {
        response.data.forEach((value: ListarReceitaDTO) => {
          temp.push({
            id: value.id,
            nome: value.nome,
            descricao: value.descricao,
            ingredientes: value.ingredientes,
            modo_preparo: value.modo_preparo,
          });
        });
        setDataTableReceitas(temp);
      }
    });
  });

  const registerReceitas = async (data: any) => {
    const tempIngredientes = [String];
    tempIngredientes.shift();
    // eslint-disable-next-line array-callback-return
    Object.keys(data).some(function (key) {
      if (key.indexOf("ingrediente") === 0) {
        tempIngredientes.push(data[key]);
      }
    });

    const tempModPrep = [String];
    tempModPrep.shift();
    // eslint-disable-next-line array-callback-return
    Object.keys(data).some(function (key) {
      if (key.indexOf("modo_preparo") === 0) {
        tempModPrep.push(data[key]);
      }
    });

    const receita = {
      nome: data.nome,
      descricao: data.descricao,
      ingredientes: tempIngredientes,
      modo_preparo: tempModPrep,
    } as ReceitasCadastrarDTO;

    await apiClassroom.post("/receita/", receita).then((response: any) => {
      if (response.status === 201) {
        toast.success("Receita cadastrada com sucesso!");
      } else {
        toast.error("Erro ao cadastrar a receita.");
      }
    });
    await queryClient.invalidateQueries("carregaReceitas");
  };

  function addInputIngred() {
    setOpenCad(false);
    const tmpIngredient = ingre;
    tmpIngredient.push(`Ingred ${ingre.length}`);
    setIngre(tmpIngredient);
    setTimeout(() => {
      setOpenCad(true);
    }, 50);
  }

  // Adiciona Inputs para Modo de Preparo
  function addInputModPrep() {
    setOpenCad(false);
    const tmpModPrep = prep;
    tmpModPrep.push(`Modo ${prep.length}`);
    setPrep(tmpModPrep);
    setTimeout(() => {
      setOpenCad(true);
    }, 50);
  }

  function remInputPrep(index: number) {
    setOpenCad(false);
    prep.splice(index, 1);
    setTimeout(() => {
      setOpenCad(true);
    }, 50);
  }

  function remInputIngre(index: number) {
    setOpenCad(false);
    ingre.splice(index, 1);
    setTimeout(() => {
      setOpenCad(true);
    }, 50);
  }

  function openReceita(index: number) {
    navigate(`/receita/${index}`);
  }

  return (
    <Container>
      <Navbar />
      <DivPresentation>
        <DivHeaderReceitas>
          <Title fontSize={40} fontWeight={600}>
            RECEITAS
          </Title>
          {auth.isAuthenticated && (
            <PrimaryButton
              text={"Cadastrar receita"}
              handleClick={handleOpen}
            />
          )}
        </DivHeaderReceitas>
        <DivCards>
          {dataTableReceitas.map((receita, index) => (
            <Card
              sx={{ minWidth: 330, borderRadius: 7, padding: 2, margin: 2 }}
              key={index}
              onClick={() => openReceita(receita.id!)}
            >
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {receita.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {receita.descricao}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
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
              <AddButton handleClick={addInputIngred} text="+" />
            </Inputs>
            {ingre.map((value: string, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <DivInput id="divIngr" key={index}>
                <input
                  id={String(index)}
                  key={index}
                  placeholder="Ingrediente *"
                  required={true}
                  {...register("ingrediente" + index)}
                ></input>
                <AddButton handleClick={() => remInputIngre(index)} text="-" />
              </DivInput>
            ))}
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
              <AddButton handleClick={addInputModPrep} text="+" />
            </Inputs>
            {prep.map((value: string, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <DivInput id="divPrep" key={index}>
                <input
                  id={String(index)}
                  key={index}
                  placeholder="Modo Preparo *"
                  required={true}
                  {...register("modo_preparo" + index)}
                ></input>
                <AddButton handleClick={() => remInputPrep(index)} text="-" />
              </DivInput>
            ))}
            <PrimaryButton text={"Cadastrar receita"} />
          </Form>
        </Box>
      </Modal>
    </Container>
  );
}
