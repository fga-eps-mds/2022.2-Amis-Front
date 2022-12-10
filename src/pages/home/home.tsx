import React, { useState } from "react";
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

const HomeText = styled.h1`
  color: ${(props) => props.theme.colors.darkGray};
  font-weight: bold;
  font-size: 60px;
`;

// Div para todo conteúdo Quem somos e Nossa missão
const DivText = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  align-items: center;
  padding: 140px 265px 195px 300px;
  text-align: center;
`;

// Título para Quem somos e Nossa missão
const TitleText = styled.h1`
  font-weight: bold;
  font-size: 60px;
  text-align: center;
  padding: 30px;
`;

// Texto para Quem somos e Nossa missão
const Text = styled.span`
  font-weight: 400px;
  font-size: 20px;
`;

// Div para região Contador
const DivContador = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  padding: 45px;
  justify-content: space-around;
`;

// Título para números Contador
const NumeroContador = styled.h1`
  font-size: 96px;
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

// Texto para descrição Contador
const TextoContador = styled.span`
  color: ${(props) => props.theme.colors.white};
  font-weight: 400px;
  font-size: 32px;
`;

export function Home() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <DivPresentationText>
          <HomeText>AMIS</HomeText>
          <HomeText>Mulheres Criativas</HomeText>
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
      <DivText>
        <TitleText>Quem Somos</TitleText>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          aliquam egestas ultricies. Morbi venenatis, odio a laoreet vulputate,
          sapien tellus ornare orci, sit amet feugiat arcu dui sed lorem.
          Maecenas et lacus vel lacus lacinia porttitor. Nulla tempus dictum
          efficitur. Suspendisse potenti. Sed ac nulla eget nunc tempor faucibus
          sed et mauris. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Suspendisse potenti. Quisque tortor ipsum, tincidunt eget ligula
          at, aliquet commodo purus. Vestibulum ante ipsum primis in faucibus
          orci luctus et ultrices posuere cubilia curae; In pretium leo ac dolor
          gravida pretium. Sed eu venenatis lacus, efficitur pulvinar massa.
          Morbi aliquet sapien vitae purus tincidunt, eget consequat erat
          iaculis. Donec ut sem ac sapien laoreet congue id et neque. Ut
          fermentum non libero ut consequat. Quisque elementum velit eget ipsum
          suscipit rutrum.
        </Text>
      </DivText>
      <DivContador>
        <div>
          <NumeroContador>98</NumeroContador>
          <TextoContador>Mulheres atendidas</TextoContador>
        </div>
        <div>
          <NumeroContador>187</NumeroContador>
          <TextoContador>Famílias impactadas</TextoContador>
        </div>
        <div>
          <NumeroContador>91</NumeroContador>
          <TextoContador>Formações profissionais</TextoContador>
        </div>
      </DivContador>
    </div>
  );
}
