import React from "react";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import Title from "../../shared/components/Title/Title";
import { Footer } from "../../shared/components/Footer/footer";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";

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
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const DivButtons = styled.div`
  width: 100%;
  display: inline-flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 auto;
  padding-top: 0px;
`;

export function ReceitasInstrucao() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivPresentationInner>
          <Title fontSize={40} fontWeight={500}>
            RECEITA 1 {/* {receita?.nome} // Esse vai ser o fixo */}
          </Title>
          <DivButtons>
            <PrimaryButton
              text={"Excluir"}
              handleClick={() => console.log("EXCLUIR")}
            />
            <PrimaryButton
              text={"Editar receita"}
              handleClick={() => console.log("EDITAR RECEITA")}
            />
          </DivButtons>
          <DivIngredientes>
            <Title fontSize={35} fontWeight={400}>
              INGREDIENTES
            </Title>
          </DivIngredientes>
        </DivPresentationInner>
      </DivPresentation>
      <Footer />
    </div>
  );
}
