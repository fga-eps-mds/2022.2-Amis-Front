import React from "react";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import Title from "../../shared/components/Title/Title";
import { Footer } from "../../shared/components/Footer/footer";

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

export function ReceitasInstrucao() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivPresentationInner>
          <div>
            <Title fontSize={40} fontWeight={500}>
              RECEITA 1
            </Title>
          </div>
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
