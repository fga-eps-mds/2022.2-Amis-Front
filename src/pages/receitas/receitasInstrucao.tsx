/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useState } from "react";
import { baseApi, userApi }  from "../../services/api";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import Title from "../../shared/components/Title/Title";
import { Footer } from "../../shared/components/Footer/footer";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ReceitasDTO } from "./dtos/receitas.dto";
import { AuthContext } from "../../context/AuthProvider";

const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

const DivPresentationInner = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 25px;
  padding: 30px;
`;

const DivIngredientes = styled.div`
  justify-content: center;
  margin-top: 40px;
`;

const ContIngredientes = styled.div`
  justify-content: center;
  padding: 20px;
  margin: 20px;
  width: 25%;
`;

const DivModoPreparo = styled.div`
  justify-content: center;
  margin-top: 40px;
`;

const ContModoPreparo = styled.div`
  justify-content: center;
  padding: 20px;
  margin: 20px;
  width: 98%;
`;

const DivButtons = styled.div`
  width: 100%;
  display: inline-flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 auto;
  padding-top: 0px;
`;

const ListaDesord = styled.ol`
  counter-reset: li;
  list-style: none;
  padding: 0;
  justify-content: space-between;
  margin-bottom: 4em;
  position: relative;
  display: block;
  padding: 0.4em 0.4em 0.4em 2em;
  *padding: 0.4em;
  margin: 15px 0;
  background: #ddd;
  text-decoration: none;
  border-radius: 0.3em;
  transition: all 0.3s ease-out;
  &:hover {
    background: #eee;
  }
  &:hover:before {
    transform: rotate(360deg);
  }
  &:before {
    content: attr(none);
    counter-increment: none;
    position: absolute;
    left: -1.3em;
    top: 50%;
    margin-top: -1.3em;
    background: #da4d3d;
    color: #fff;
    height: 2em;
    width: 2em;
    line-height: 2em;
    border: 0.3em solid #fff;
    text-align: center;
    font-weight: bold;
    border-radius: 2em;
    transition: all 0.3s ease-out;
  }
`;

const ListaOrd = styled.ol`
  counter-reset: li;
  list-style: none;
  padding: 0;
  margin-bottom: 4em;
  position: relative;
  display: block;
  padding: 0.4em 0.4em 0.4em 2em;
  *padding: 0.4em;
  margin: 15px 0;
  background: #ddd;
  text-decoration: none;
  border-radius: 0.3em;
  transition: all 0.3s ease-out;
  &:hover {
    background: #eee;
  }
  &:hover:before {
    transform: rotate(360deg);
  }
  &:before {
    content: counter(li);
    counter-increment: li;
    position: absolute;
    left: -1.3em;
    top: 50%;
    margin-top: -1.3em;
    background: #da4d3d;
    color: #fff;
    height: 2em;
    width: 2em;
    line-height: 2em;
    border: 0.3em solid #fff;
    text-align: center;
    font-weight: bold;
    border-radius: 2em;
    transition: all 0.3s ease-out;
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
`;

export function ReceitasInstrucao() {
  const { index } = useParams();
  const [receitaDetail, setReceitaDetail] = useState<ReceitasDTO>();
  const auth = useContext(AuthContext);

  const removeReceita = async (id: number) => {
    await baseApi.delete("/receita/" + id).then((response: any) => {
      console.log(response.data);
      if (response.status === 204) {
        toast.success("Receita excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a turma.");
      }
    });
  };

  useQuery("carregaReceitas", async () => {
    await baseApi.get(`/receita/${index}`).then((response: any) => {
      console.log(response.data);
      if (response.status === 200) {
        setReceitaDetail(response.data);
        console.log("receita", receitaDetail);
      }
    });
  });

  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivPresentationInner>
          <Nav>
            <Title fontSize={40} fontWeight={700} style={{ width: "60%" }}>
              {receitaDetail?.nome}
            </Title>
            <DivButtons>
              {auth.isAuthenticated && (
                <PrimaryButton
                  text={"Excluir Receita"}
                  handleClick={async () => await removeReceita(Number(index))}
                />
              )}
              {/* <PrimaryButton
                text={"Editar receita"}
                handleClick={() => console.log("EDITAR RECEITA")}
              /> */}
            </DivButtons>
          </Nav>
          <DivIngredientes>
            <Title
              fontSize={35}
              fontWeight={500}
              style={{ textAlign: "center" }}
            >
              INGREDIENTES
            </Title>
            <ContIngredientes>
              {receitaDetail?.ingredientes &&
                receitaDetail?.ingredientes.map((ingrediente, index) => (
                  <ListaDesord key={index}>
                    <li>{ingrediente.descricao}</li>
                  </ListaDesord>
                ))}
            </ContIngredientes>
          </DivIngredientes>
          <DivModoPreparo>
            <Title
              fontSize={35}
              fontWeight={500}
              style={{ textAlign: "center" }}
            >
              MODO DE PREPARO
            </Title>
            <ContModoPreparo>
              {receitaDetail?.modo_preparo?.map((etapa: any, index) => (
                <ListaDesord key={index}>
                  <li>{etapa?.descricao}</li>
                </ListaDesord>
              ))}
            </ContModoPreparo>
          </DivModoPreparo>
        </DivPresentationInner>
      </DivPresentation>
      <Footer />
    </div>
  );
}
