import React from "react";
import { Navbar } from "../../shared/components/Navbar/navbar";
import styled from "styled-components";
import home_image1 from "../../assets/home_image1.png";
import home_image2 from "../../assets/home_image2.png";
import Button from "../../shared/components/Button/Button";

const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 120px 120px 150px;
`;

const DivPresentationText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  border-radius: 35%;
`;

export function Home() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivPresentationText>
          <h1>AMIS</h1>
          <h1>Mulheres Criativas</h1>
          <span style={{ paddingTop: "30px" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </span>
          <span style={{ paddingBottom: "30px" }}>
            Varius sed pharetra dictum neque massa congue
          </span>
          <div>
            <Button>Saiba Mais</Button>
            <Button style={{ marginLeft: "16px" }}>Faça um Pedido</Button>
          </div>
        </DivPresentationText>
        <div style={{ position: "relative" }}>
          <Image
            src={home_image1}
            style={{
              width: "350px",
              zIndex: 5,
              position: "absolute",
              bottom: -80,
              left: -300,
            }}
          ></Image>
          <Image
            src={home_image2}
            style={{ width: "400px", zIndex: 0 }}
          ></Image>
        </div>
      </DivPresentation>
    </div>
  );
}
